import React, { Component, Fragment } from 'react'
import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";
import { compose } from "redux";
import { Redirect } from "react-router-dom";
import firebase from 'firebase/app';
const alpha = require('alphavantage')({ key: "40XXVQ2Y2VPRG3M0" });

export class Holdings extends Component {

	state = {
		tickers: {}
	}

	componentDidMount = () => {
	 	const db = firebase.firestore();
	 	const uid = firebase.auth().currentUser.uid;
	 	const collectionRef = db.collection(`user`).doc(uid).collection(`transactions`);
	 	let tickers = {};
	 	collectionRef
	 		.where("transactionType", "==", "buy")
	 		.get()
	 		.then(querySnapshot => {
	 			const self = this;
	 			querySnapshot.forEach(doc => {
	 				let obj = doc.data();
					let key = obj.ticker;
					let value = Number(obj.sharesAvailable);
					if (!(key in tickers)) {
						
						tickers[key] = {totalShares: value, currentPrice: 0, totalValue: 0};

					}
					else if((key in tickers)){
						let total = tickers[key] ? Number(tickers[key].totalShares) : 0;
						total += value;
						tickers[key].totalShares = total;						
					}					
				},this)
				self.setState({tickers:tickers});
		})
		.then( s =>{
			let ticks = this.state.tickers;
			for( const [key,value] of Object.entries(ticks) ){
				alpha.data.quote(key, "json").then( data =>{
					let stock = ticks[key];
					let curPrice = Number(data["Global Quote"]["05. price"]);
					curPrice = curPrice.toFixed(2);
					stock.currentPrice = curPrice;
					this.setState(stock);
				})
				.then(x => {
					let ticks = this.state.tickers;
					for (const [key, value] of Object.entries(ticks)) {
						let totalVal = value["totalShares"] * value["currentPrice"];
						value.totalValue = totalVal;
						this.setState(value);
					}
				})
			}
		})
		.catch(function(error) {
            console.log("Error getting document:", error);
		});  
		
	}
	
	render() {
		const { auth } = this.props;
		let valToDisplay ;
		if (!auth.uid) {
			return <Redirect to="/signin" />;
		}
		// //this.myFunc();
		// console.log(this.state)
	
	const holdings = Object.keys(this.state.tickers).map(((key, index) =>
		(<tr key={index}>
			<td>{key}</td>
			<td>{this.state.tickers[key]["totalShares"]}</td>
			<td>{this.state.tickers[key]["currentPrice"]}</td>
			<td>{this.state.tickers[key]["totalValue"]}</td>
		</tr>)));

	return(
		<div>
		<table>
			<tbody>
			<tr>
				<th><h6>Stock Ticker</h6></th>
				<th><h6>Total Number of Shares</h6></th>
				<th><h6>Current Price</h6></th>
				<th><h6>Total Value</h6></th>
			</tr>
			{holdings}
			</tbody>
		</table>
		
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
)(Holdings);
