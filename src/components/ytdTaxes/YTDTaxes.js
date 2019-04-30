import React, { Component } from 'react'
import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";
import { compose } from "redux";
import firebase from 'firebase/app';
import { couldStartTrivia } from 'typescript';

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
      let longTermGain = 0;
      let shortTermGain = 0;
      let longTax = 0;
      let shortTax = 0;
      let tax = 0;
      const userRef = db.collection(`user`).doc(uid);
      const collectionRef = db.collection(`taxes`).doc("9GlfLqRkffAtVIV2onjC").collection(`taxTable`);
      const transactionRef = db.collection(`user`).doc(uid).collection(`transactions`);
      const capTaxRef = db.collection(`taxes`).doc("9GlfLqRkffAtVIV2onjC").collection(`capGainTaxTable`);

      
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
                    baseTax = Number((obj.floorTax + (income - lowIncome) * rate).toFixed(2));
                    console.log("basetax: ", baseTax);
                  }
                })
            })
        )
        .then (
          transactionRef
          .where("transactionType", "==", "sell")
          .get()
          .then(querySnapshot => {
            querySnapshot.forEach(doc => {
              let obj = doc.data();
              longTermGain += obj.longTermGain;
              shortTermGain += obj.shortTermGain;
              console.log("ltg: ", longTermGain);
              console.log("stg: ", shortTermGain);
            })
          })
        )
        .then (
          collectionRef
          .where("filingStatus","==", filingstatus)
          .get()
          .then(querySnapshot =>
            {
              querySnapshot.forEach(doc => {
                const obj = doc.data();
                const lowIncome = obj.minIncome;
                const highIncome = obj.maxIncome;
                income += shortTermGain;
                let rate = 0;
                if (income > lowIncome && income <= highIncome) {
                  rate = obj.taxRate;
                  shortTax += Number((obj.floorTax + (income - lowIncome) * rate).toFixed(2));
                }
                console.log("stt: ",shortTax);
              })
            })
        )
        .then (
          capTaxRef
          .where("filingStatus","==", filingstatus)
          .get()
          .then(querySnapshot =>
            {
              querySnapshot.forEach( doc => {
                const obj = doc.data();
                const lowIncome = obj.minIncome;
                const highIncome = obj.maxIncome;
                let rate = 0;
                if (income > lowIncome && income <= highIncome) {
                  rate = obj.taxRate;
                  longTax += Number((longTermGain * rate).toFixed(2));
                }
                console.log("ltt: ", longTax);

                tax = shortTax + longTax - baseTax;
                
                console.log("taxes: ", tax);
                this.setState({taxes: tax.toFixed(2)});

               // this.setState({taxes: tax});
               // this.forceUpdate();
              })
            })
        );
      })
      
  }

    render() {
        return (
           <div className="InfoBox row center">
                    <div className="col s6"><h5><strong>YTD Taxes:</strong></h5> </div>
                    <div className="col s6" id="ytdTaxes"><h5>{this.state.taxes}</h5></div>
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