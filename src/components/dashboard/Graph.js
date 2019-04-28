import React, { Component } from 'react'
import { HorizontalBar } from 'react-chartjs-2';

import firebase from 'firebase/app';
import moment from 'moment';
const alpha = require('alphavantage')({ key: "40XXVQ2Y2VPRG3M0" });

const today1 = new Date();
const today2 = new Date();
const today3 = new Date();
const today4 = new Date();
const today5 = new Date();
const today6 = new Date();

const todayone = new Date();
const oneDayAgo = new Date(today6.setDate(today6.getDate() - 1));
const twoDaysAgo = new Date(today1.setDate(today1.getDate() - 2));
const threeDaysAgo = new Date(today2.setDate(today2.getDate() - 3));
const fourDaysAgo = new Date(today3.setDate(today3.getDate() - 4));
const fiveDaysAgo = new Date(today4.setDate(today4.getDate() - 5));
const sixDaysAgo = new Date(today5.setDate(today5.getDate() - 6));

const sixdays = moment(sixDaysAgo).format('YYYY-MM-DD');
const fivedays = moment(fiveDaysAgo).format('YYYY-MM-DD');
const fourdays = moment(fourDaysAgo).format('YYYY-MM-DD');
const threedays = moment(threeDaysAgo).format('YYYY-MM-DD');
const twodays = moment(twoDaysAgo).format('YYYY-MM-DD');
const onedays = moment(oneDayAgo).format('YYYY-MM-DD');
const today = moment(todayone).format('YYYY-MM-DD');


export default class Graph extends Component {

    state = {
        tickerName: [],
        data: []
    }

componentDidMount() {
    const db = firebase.firestore();
    const uid = firebase.auth().currentUser.uid;
    const collectionRef = db.collection(`user`).doc(uid).collection(`transactions`);
    let unique = {};
    collectionRef
        .where("transactionType", "==", "buy")
        .where("date", ">=", twodays)
        .where("date", "<=", today)
        .orderBy("date", "asc")
        .get()
        .then(querySnapshot => {
            const self = this;
            let dataVal = [];
            let tickerVal = [];
            querySnapshot.forEach(doc => {
                let obj = doc.data();
                let key = obj.ticker;
                let value = Number(obj.sharesAvailable);
              
                if (!(key in unique)) {
                    // unique[key] = obj;
                    unique[key] = {totalShares: value}
                } else  if (key in unique) {
                    let total = unique[key] ? Number(unique[key].totalShares) : 0;
                    total+= value;
                    unique[key].totalShares = Number(total);
                }
           },this)
  
                
           let data = [];
           data = Object.entries(unique).forEach(entry => {
                let key = entry[0];
                let value = entry[1].totalShares;
                dataVal.push(value);
                tickerVal.push(key);
           })
           this.setState({
                tickerName: tickerVal,
                data: dataVal
           })

        })
        .catch(function(error) {
            console.log("Error getting document:", error);
        });  
}

  render() {
    const dataValues = this.state.data;
    const tickerName = this.state.tickerName;
    let data = {
        labels: tickerName,
        datasets: [{
          label: "Total Stock Value",
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
          ],
          borderColor: [
            'rgba(255,99,132,1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1,
          data: dataValues,
        }]
      };
    // const data = {
    //     labels: [
    //         sixdays,
    //         fivedays,
    //         fourdays,
    //         threedays,
    //         twodays,
    //         onedays,
    //         today, 
    //     ],
    //     datasets: [
    //         {
    //         label: 'Total Stock Value',
    //         fill: true,
    //         lineTension: 0.1,
    //         backgroundColor: '#FF6347',
    //         borderColor: '#FF6347',
    //         borderCapStyle: 'butt',
    //         borderDash: [],
    //         borderDashOffset: 0.0,
    //         borderJoinStyle: 'miter',
    //         pointBorderColor: '#FF6347',
    //         pointBackgroundColor: '#fff',
    //         pointBorderWidth: 5,
    //         pointHoverRadius: 5,
    //         pointHoverBackgroundColor: '#FF6347',
    //         pointHoverBorderColor: '#FF6347',
    //         pointHoverBorderWidth: 2,
    //         pointRadius: 1,
    //         pointHitRadius: 10,
    //         data: dataValues
    //         }
    //     ],
    //     };
    return (
      <div>
        <div className="graph z-depth-4">
			<HorizontalBar data={data} 
				width={400} 
				height={500}
				options={{ 
					maintainAspectRatio: false,
					scales: {
						xAxes: [{
						  ticks: {
							beginAtZero: true
						  }
						}]
					  } 
				}}
			/>
        </div>
      </div>
    )
  }
}
