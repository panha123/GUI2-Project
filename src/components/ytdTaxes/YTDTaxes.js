import React, { Component } from 'react'
import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";
import { compose } from "redux";
import firebase from 'firebase/app';

export class YTDTaxes extends Component {
  state = {
    taxes: 0
  }

    componentDidMount() {
    
      const db = firebase.firestore();
      const uid =firebase.auth().currentUser.uid;

      let filingstatus = "";
      let income = 0;
      let baseTax = 0;
      const userRef = db.collection(`user`).doc(uid);
      const collectionRef = db.collection(`taxes`).doc("9GlfLqRkffAtVIV2onjC").collection(`taxTable`);
      
      userRef.get()
      .then( doc => {
           const userObj = doc.data();
          filingstatus = userObj.filingstatus;
          income = userObj.income;
          return {
            filingstatus: filingstatus,
            income: income
          }
      })
      .then( user => {
        //console.log("filingstatus", user.filingstatus)
        //console.log("income", income)
        collectionRef
        .where("filingStatus", "==", user.filingstatus)
        .limit(1)
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            const obj = doc.data();
            const deduction = obj.deduction;
            income = user.income - deduction;
            return {
              filingstatus: user.filingstatus,
              income: income,
            }
          })
        })
        .then(          
          collectionRef
            .where("filingStatus", "==", filingstatus)
            .get()
            .then( querySnapshot => {
                querySnapshot.forEach(doc => {
                  const obj = doc.data();
                  const lowIncome = obj.minIncome;
                  const highIncome = obj.maxIncome;
                  let rate = 0;
                  if (income > lowIncome && income <= highIncome) {
                    rate = obj.taxRate;
                    //console.log("rate", rate);
                    baseTax = Number((obj.floorTax + (income - lowIncome) * rate).toFixed(2));
                    console.log(baseTax);
                  }
                })
            })
        );
      })
  }

    render() {
        return (
           <div className="InfoBox row center">
                    <div className="col s6">YTD Taxes: </div>
                    <div className="col s6" id="ytdTaxes">{this.state.taxes}</div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
      projects: state.firestore.ordered.projects,
      auth: state.firebase.auth
    };
  };

export default compose(
    connect(mapStateToProps),
    firestoreConnect([{ collection: "transactions" }])
  )(YTDTaxes);