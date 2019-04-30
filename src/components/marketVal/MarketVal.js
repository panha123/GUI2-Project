import React, { Component } from 'react'
import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";
import { compose } from "redux";
import firebase from 'firebase/app';
//const alpha = require('alphavantage')({ key: "40XXVQ2Y2VPRG3M0" });
//const alpha = require('alphavantage')({ key: "XO9H6Q11ELMK0F9O" });
const alpha = require('alphavantage')({ key: "BJIZGIKC7VW3D5W2" });
//const alpha = require('alphavantage')({ key: "7777LBUKJQ3YGWHW" });




export class MarketVal extends Component {
  state = {
    totalVal: 0
  }

    componentDidMount() {
      const db = firebase.firestore();
      const uid =firebase.auth().currentUser.uid;

      db.collection(`user/${uid}/transactions`).onSnapshot((querySnapshot) => {
        let total = 0;;
          querySnapshot.forEach((doc) => {
            const obj = doc.data();
            console.log(obj);
            let shares = obj.sharesAvailable;
            console.log("shares: ", shares);
            let tick = obj.ticker;
            let curPrice = 0;
            alpha.data.quote(tick, "json").then( data =>{
              curPrice = Number(data["Global Quote"]["05. price"]);
              curPrice = Number(curPrice.toFixed(2));
              console.log(tick + " " + curPrice);
              if (doc.data().transactionType === "buy"){
                total += (curPrice * Number(shares));
                console.log("t+ ", total);
                this.setState({
                  totalVal: total
              });
              }
              else {
                  total -= (curPrice * Number(shares));
                  console.log("t- ", total);
                  this.setState({
                    totalVal: total
                });
              }
            })
            console.log("total  ", total);
            
           });
         
      });    
  }
    render() {
        return (
           <div className="InfoBox row center">
                    <div className="col s6"><h5><strong>Market Value: </strong></h5> </div>
                    <div className="col s6" id="marketValue"><h5>{this.state.totalVal}</h5></div>
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
  )(MarketVal);