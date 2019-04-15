import React, { Component } from 'react'
import { Line } from 'react-chartjs-2';
import firebase from 'firebase/app';
import moment from 'moment';

const alpha = require('alphavantage')({ key: "40XXVQ2Y2VPRG3M0" });

export default class Graph extends Component {
state = {
    total: {
        date: '',
        numberOfShares: 0,
        totalValue: 0
    },
    data: [750, 290, 300, 410, 660, 550, 900]
}

componentDidMount() {
    const db = firebase.firestore();
    const uid = firebase.auth().currentUser.uid;
    const collectionRef = db.collection(`user`).doc(uid).collection(`transactions`);
    let unique = [];
    collectionRef
        .where("transactionType", "==", "buy")
        .orderBy("date", "asc")
        .get()
        .then(querySnapshot => {
            const self = this;
            querySnapshot.forEach(doc => {
                let obj = doc.data();
                let key = obj.ticker;
                if (!(key in unique)) {
                    unique.push(key);
                } 
                console.log(obj);
           },this)
        //    let uniqueTicker = unique.filter(function(item, index){
        //     return unique.indexOf(item) >= index;
        // });
        
        //    return uniqueTicker;
        })
        .then( s =>{
            // console.log(s);
            // let ticks = this.state.tickers;
            // for( const [key,value] of Object.entries(ticks)){
            //     alpha.data.quote(key, "json").then( data =>{
            //         let stock = ticks[key];
            //         let curPrice = Number(data["Global Quote"]["05. price"]);
            //         curPrice = curPrice.toFixed(2);
            //         stock.currentPrice = curPrice;
            //         this.setState(stock);
            //     })
            //     .then(x => {
            //         let ticks = this.state.tickers;
            //         //    let graphData = []
            //         for (const [key, value] of Object.entries(ticks)) {
            //             let totalVal = value["totalShares"] * value["currentPrice"];
            //             value.totalValue = totalVal;
            //             //    console.log(value.totalValue);
            //             //    graphData.push(totalVal);
            //             this.setState(value);
            //         }
            //     })
            // }
        })
        .catch(function(error) {
            console.log("Error getting document:", error);
        });  
}

  render() {
    const dataValues = this.state.data;
    
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

    const data = {
        labels: [
            sixdays,
            fivedays,
            fourdays,
            threedays,
            twodays,
            onedays,
            today, 
        ],
        datasets: [
            {
            label: 'Total Stock Value',
            fill: true,
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
            data: dataValues
            }
        ],
        };
    return (
      <div>
        <div className="graph z-depth-4">
            <Line data={data} width={400} height={100}/>
        </div>
      </div>
    )
  }
}
