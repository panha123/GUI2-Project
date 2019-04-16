import React, { Component } from 'react';
import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";
import firebase from 'firebase/app';
import { compose } from "redux";
import { Redirect } from "react-router-dom";
import {Avatar} from '../avatar/Avatar';
import {InfoBox} from '../infoBox/InfoBox';
import Graph from './Graph';

export class Dashboard extends Component {

  handleSubmit = (e) => {
    e.preventDefault();
    const db = firebase.firestore();
    const uid =firebase.auth().currentUser.uid;
    const cost = Number(e.target.fee.value) +  Number(e.target.numberOfShares.value * e.target.price.value);
    const subcollections =[];
    const collectionRef = db.collection(`user`).doc(uid).collection(`transactions`);

    if (e.target.transactionType.value === "buy") {
      collectionRef.add({
        ticker: e.target.ticker.value.toUpperCase(),
        numberOfShares: Number(e.target.numberOfShares.value),
        price: Number(e.target.price.value),
        date: e.target.date.value,
        fee: Number(e.target.fee.value),
        transactionType: e.target.transactionType.value,
        totalCost : cost,
        remainingCost: cost,
        sharesAvailable: Number(e.target.numberOfShares.value),
        gain: 0
      })
      .then(function(docRef) {
        console.log("Document written with ID: ", docRef.id);
      })
      .catch(function(error) {
          console.error("Error adding document: ", error);
      });
    }
    else {

      let tick = e.target.ticker.value.toUpperCase();
      let shares = Number(e.target.numberOfShares.value);
      let sellPrice = Number(e.target.price.value);
      let date = e.target.date.value;
      let sellingFee = Number(e.target.fee.value);
      let transactionType = e.target.transactionType.value;
      let proceeds = Number(shares * sellPrice  - sellingFee);
      let proceedsPerShare = Number((proceeds / shares).toFixed(2))
      let sharesRemaining = Number(shares);
      collectionRef
      .where("ticker", "==", tick)
      .where("transactionType", "==", "buy")
      .orderBy("date")
      .get()
      .then(querySnapShot => {
        querySnapShot.docs.forEach( doc => {
          let obj = doc.data();
        
          let purchaseShares = Number(obj.numberOfShares);
          let sharesAvailable = Number(obj.sharesAvailable);
          let remainingCost = Number(obj.remainingCost);
          let totalCost = Number(obj.totalCost);
          let fee = Number(obj.fee);
          let gain = Number(obj.gain);

          let sharesToSell = Math.min(sharesAvailable, sharesRemaining);
          let costPerShare = (totalCost + fee) / purchaseShares;
          let costToSell = Math.min( remainingCost, (sharesToSell * costPerShare));

          let proceedsForLot = proceedsPerShare * sharesToSell;

          if (sharesRemaining !== 0 && sharesAvailable !== 0) {
            sharesRemaining = sharesRemaining - sharesToSell;
            remainingCost = Number((remainingCost - costToSell).toFixed(2));
            let gainOnLot = proceedsForLot - costToSell;
            proceeds = proceeds - costToSell;
            sharesAvailable = sharesAvailable - sharesToSell;

            obj.sharesAvailable = sharesAvailable;
            obj.remainingCost = remainingCost;
            obj.gain = gain + gainOnLot;
            doc.ref.update(obj);
          }
        })

      collectionRef.add({
        ticker: tick,
        numberOfShares: shares,
        price: sellPrice,
        date: date,
        fee: sellingFee,
        transactionType: transactionType,
        gain: proceeds
      })
      .then(function(docRef) {
        console.log("Document written with ID: ", docRef.id);
      })
      .catch(function(error) {
          console.error("Error adding document: ", error);
      });
        
      })
    }
   
    }

  render() {
    const { auth } = this.props;
    


    if (!auth.uid) {
      return <Redirect to="/signin" />;
    }
    return (
      <div className="dashboard row main-dash">
        <div className="col m3 left z-depth-4 leftnav">
          <Avatar />
          <br/><br/><br/>
          <InfoBox />
        </div>

        <div className="col m8 right rightnav">
            <Graph/>
            <form onSubmit={this.handleSubmit}>
                  <div className="inputfield">
                    <div>
                      <label htmlFor="ticker">Stock Ticker Symbol</label>
                      <input required type="text" name="ticker"></input>
                    </div>
                    <div >
                      <label htmlFor="date">Date</label>
                      <input required type="date" name="date"></input>
                    </div>
                    <div>
                      <label htmlFor="numberOfShares">Number of shares</label>
                      <input required type="number" min="1" name="numberOfShares"></input>
                    </div>
                    <div>
                      <label htmlFor="price">Price</label> 
                      <input required type="number" step="0.01"  min="0.01" name="price"></input>
                    </div>
                    <div>
                      <label htmlFor="fee">Fee</label> 
                      <input required type="number" step="0.01"  min="0.01" name="fee"></input>
                    </div>
                  </div>
                <br/>
                <div className="row container">
                  <div className="row">
                    <label>
                      <input name="group1" type="radio" />
                      <span className="radiobutton" name="scenario" value="whatIf">What If Simulation</span>
                    </label>
                      
                    <label>
                      <input name="group1" type="radio" />
                      <span className="radiobutton" name="scenario" value="record">Record</span>
                    </label>
                  </div>
                  <div className="row">
                  <label>
                        <input name="group2" name="transactionType" value="buy" type="radio" />
                        <span className="radiobutton" >Buy</span>
                      </label>
                      <label>
                        <input name="group2" name="transactionType" value="sell" type="radio" />
                        <span className="radiobutton" >Sell</span>
                      </label>
                  </div>   
                  <br/> 
                    <button type="submit" className="waves-effect waves-light green btn" value="submit">Submit</button> 
                </div>
            </form>
            
        </div>
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
  firestoreConnect([{ collection: "projects" }])
)(Dashboard);
