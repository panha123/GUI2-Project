import React, { Component } from 'react';
import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";
import firebase from 'firebase/app';
import { compose } from "redux";
import { Redirect } from "react-router-dom";
import { Line } from 'react-chartjs-2';
import {Avatar} from '../avatar/Avatar';
import {InfoBox} from '../infoBox/InfoBox';


export class Dashboard extends Component {

  handleSubmit = (e) => {
    e.preventDefault();
    const db = firebase.firestore();
    console.log(e.target.transactionType);
    db.collection("transactions").add({
        ticker: e.target.ticker.value.toUpperCase(),
        numberOfShares: e.target.numberOfShares.value,
        price: e.target.price.value,
        date: e.target.date.value,
        fee: e.target.fee.value,
        /*transactionType: e.target.transactionType.value*/
      })
      .then(function(docRef) {
          console.log("Document written with ID: ", docRef.id);
      })
      .catch(function(error) {
          console.error("Error adding document: ", error);
      });
    }

  render() {
    const { auth } = this.props;
    const data = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
        {
          label: 'Apple',
          fill: false,
          lineTension: 0.1,
          backgroundColor: '#4CAF50',
          borderColor: '#4CAF50',
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: '#4CAF50',
          pointBackgroundColor: '#fff',
          pointBorderWidth: 5,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: '#4CAF50',
          pointHoverBorderColor: '#4CAF50',
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: [65, 59, 80, 81, 56, 55, 40]
        },
        {
          label: 'Facebook',
          fill: false,
          lineTension: 0.1,
          backgroundColor: '#FF6347',
          borderColor: '#FF6347',
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: '#FF6347',
          pointBackgroundColor: '#fff',
          pointBorderWidth: 5,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: '#FF6347',
          pointHoverBorderColor: '#FF6347',
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: [15, 29, 30, 41, 66, 55, 90]
        }
      ]
    };


    if (!auth.uid) {
      return <Redirect to="/signin" />;
    }
    return (
      <div className="dashboard row main-dash">
        {/* 
          left side dashboard
          - user avatar
          - transaction data
          - equity
          - YTD Gains
          - YTD Taxes
        */}
        <div className="col m3 left z-depth-4 leftnav">
          <Avatar />
          <br/><br/><br/>
          <InfoBox />
        </div>

        <div className="col m8 right rightnav">
            <div className="graph z-depth-4">
              <Line data={data} width={400} height={100}/>
            </div>
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
                        <input name="group2" type="radio" />
                        <span className="radiobutton" name="transactionType" value="buy">Buy</span>
                      </label>
                      <label>
                        <input name="group2" type="radio" />
                        <span className="radiobutton" name="transactionType" value="sell">Sell</span>
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
