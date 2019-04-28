import React, { Component } from 'react';
import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";
import firebase from 'firebase/app';
import { compose } from "redux";
import { Redirect } from "react-router-dom";
import {Avatar} from '../avatar/Avatar';
import {InfoBox} from '../infoBox/InfoBox';
import Graph from './Graph';
import moment from 'moment';
import Select, { createFilter } from "react-select";
import * as d3 from 'd3';
import file from '../../files/Ticker.csv';

let searchItems = []

d3.csv(file, (data) => {
  searchItems.push({value:data.Symbol, label: data.Name});
})

export class Dashboard extends Component {

  state = {
    suggestion : '',
    redirectTo: false
  }

  handleSuggestion = (e) => {
    this.setState({
      suggestion: e.value
    })
  } 

  handleSubmit = (e) => {
    e.preventDefault();
    const db = firebase.firestore();
    const uid =firebase.auth().currentUser.uid;
    const cost = Number(e.target.fee.value) +  Number(e.target.numberOfShares.value * e.target.price.value);
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
        gain: 0,
        longTermGain: 0,
        shortTemGain:0
      })
      .then(function(docRef) {
        console.log("Document written with ID: ", docRef.id);
      })
      .catch(function(error) {
          console.error("Error adding document: ", error);
      });
    }
    else if( e.target.transactionType.value === "sell" ) {

      let tick = e.target.ticker.value.toUpperCase();
      let shares = Number(e.target.numberOfShares.value);
      let sellPrice = Number(e.target.price.value);
      let date = e.target.date.value;
      let sellingFee = Number(e.target.fee.value);
      let transactionType = e.target.transactionType.value;
      let proceeds = Number(shares * sellPrice  - sellingFee);
      let proceedsPerShare = Number((proceeds / shares).toFixed(2))
      let sharesRemaining = Number(shares);
      let ltGain = 0;
      let stGain = 0;

      collectionRef
      .where("ticker", "==", tick)
      .where("transactionType", "==", "buy")
      .orderBy("date")
      .get()
      .then(querySnapShot => {

        if(querySnapShot.docs.length > 0){

          //get the total shares
          let totalSharesOwned = 0;
          querySnapShot.docs.forEach( doc => {
            let obj = doc.data();
            totalSharesOwned += Number(obj.sharesAvailable);
          })

          if( totalSharesOwned >= sharesRemaining )
          { 
            querySnapShot.docs.forEach( doc => {
              let obj = doc.data();
            
              let purchaseShares = Number(obj.numberOfShares);
              let sharesAvailable = Number(obj.sharesAvailable);
              let remainingCost = Number(obj.remainingCost);
              let totalCost = Number(obj.totalCost);
              let fee = Number(obj.fee);
              let gain = Number(obj.gain);
              let buyDate = obj.date;
    
              let sharesToSell = Math.min(sharesAvailable, sharesRemaining);
              let costPerShare = (totalCost + fee) / purchaseShares;
              let costToSell = Math.min( remainingCost, (sharesToSell * costPerShare));
    
              let proceedsForLot = proceedsPerShare * sharesToSell;
    
              if (sharesRemaining !== 0 && sharesAvailable !== 0) {
                sharesRemaining = sharesRemaining - sharesToSell;
                remainingCost = Number((remainingCost - costToSell).toFixed(2));
                let gainOnLot = proceedsForLot - costToSell;
                let bDate = new Date(buyDate);
                let sDate = new Date(date);
                let diffDate = Math.abs(sDate.getTime() - bDate.getTime());
                let diffDays = Math.ceil(diffDate / (1000 * 60 * 60 * 24));
                proceeds = proceeds - costToSell;
                sharesAvailable = sharesAvailable - sharesToSell;
    
                obj.sharesAvailable = sharesAvailable;
                obj.remainingCost = remainingCost;
                obj.gain = gain + gainOnLot;
                if (diffDays > 365) {
                      obj.longTermGain = gainOnLot;
                      ltGain += gainOnLot;
                }
                else {
                  obj.shortTermGain = gainOnLot;
                  stGain += gainOnLot;
                }
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
              gain: proceeds,
              shortTermGain: stGain,
              longTermGain: ltGain
            })
            .then(function(docRef) {
              console.log("Document written with ID: ", docRef.id);
            })
            .catch(function(error) {
                console.error("Error adding document: ", error);
            });
          }
          else 
            alert("Insufficient amount of shares to sell!!!")
        }  
        else 
          alert("Sorry you don't own the stocks!!!")  
      })
    }

    
    this.setState({
      redirectTo: true
    })
    e.target.reset();
  }


  render() {

    const { auth } = this.props;
    let date = new Date();
    let redirectTo = this.state.redirectTo;

    if(redirectTo === true) {
      this.setState({
        redirectTo: false
      })
      return <Redirect to="/" />;
    }

    date = moment(date).format('YYYY-MM-DD');
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
                      <label htmlFor="ticker"><h6 className="blue-text text-darken-4">Stock Ticker Symbol</h6></label>
                      <Select
                          id="suggestion"
                          filterOption={createFilter({ ignoreAccents: false })}
                          value={{label: this.state.suggestion , value: this.state.suggestion}}
                          onChange={this.handleSuggestion}
                          options={searchItems}
                          name="ticker"
                          required
                      />
                    </div>
                    <div >
                      <label htmlFor="date"><h6 className="blue-text text-darken-4">Date</h6></label>
                      <input type="date" name="date" defaultValue={date}/>
                    </div>
                    <div>
                      <label htmlFor="numberOfShares"><h6 className="blue-text text-darken-4">Number of shares</h6></label>
                      <input required type="number" min="1" name="numberOfShares"/>
                    </div>
                    <div>
                      <label htmlFor="price"><h6 className="blue-text text-darken-4">Price</h6></label> 
                      <input required type="number" step="0.01"  min="0.01" name="price"/>
                    </div>
                    <div>
                      <label htmlFor="fee"><h6 className="blue-text text-darken-4">Fee</h6></label> 
                      <input required type="number" step="0.01"  min="0" name="fee"/>
                    </div>
                  </div>
                <br/>
                <div className="row container">
                  <div className="row">
                  <label>
                        <input name="group2" name="transactionType" value="buy" required type="radio" />
                        <span className="radiobutton" ><h6 className="blue-text text-darken-4">Buy</h6></span>
                      </label>
                      <label>
                        <input name="group2" name="transactionType" value="sell" required type="radio" />
                        <span className="radiobutton" ><h6 className="blue-text text-darken-4">Sell</h6></span>
                      </label>
                  </div>   
                  <br/> 
                    <button type="submit" className="waves-effect waves-light green btn" value="submit"><strong>Submit</strong></button> 
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
