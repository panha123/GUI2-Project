import React, { Component, Fragment } from 'react'
import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";
import { compose } from "redux";
import { Redirect } from "react-router-dom";
import firebase from 'firebase/app';
const alpha = require('alphavantage')({ key: "LQGPQG13311MZSX7" });

export class Holdings extends Component {

	state = {tickers:null};

	// componentDidMount = () => {
	// 	const db = firebase.firestore();
	// 	const uid = firebase.auth().currentUser.uid;
	// 	const collectionRef = db.collection(`user`).doc(uid).collection(`transactions`);
	// 	let tickers = {};
	// 	collectionRef
	// 		.where("transactionType", "==", "buy")
	// 		.get()
	// 		.then(querySnapshot => {
	// 			const self = this;
	// 			querySnapshot.forEach(doc => {
	// 				let obj = doc.data();
	// 				let key = obj.ticker;
	// 				let value = Number(obj.sharesAvailable);
	// 				if (!(key in tickers)) {
						
	// 					tickers[key] = {totalShares: value, currentPrice: 0};

	// 				}
	// 				else if((key in tickers)){
	// 					let total = tickers[key] ? Number(tickers[key].totalShares) : 0;
	// 					total += value;
	// 					tickers[key].totalShares = total;						
	// 				}					
	// 			},this)
	// 			self.setState({tickers:tickers});
	// 	})
	// 	.then( s =>{
	// 		let ticks = this.state.tickers;
	// 		for( const [key,value] of Object.entries(ticks) ){
	// 			alpha.data.quote(key, "json").then( data =>{
	// 				let curPrice = Number(data["Global Quote"]["05. price"]);
	// 				this.state.tickers[key].currentPrice = curPrice.toFixed(2);
	// 			})


	// 		}
			
	// 	})
	// 	.catch(function(error) {
    //         console.log("Error getting document:", error);
	// 	});  
		
	// }
	myFunc() {
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
						
						tickers[key] = {totalShares: value, currentPrice: 0};

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
					let curPrice = Number(data["Global Quote"]["05. price"]);
					this.state.tickers[key].currentPrice = curPrice.toFixed(2);
				})


			}
			
		})
		.catch(function(error) {
            console.log("Error getting document:", error);
		});  
	}
	render() {
		const { auth } = this.props;
		if (!auth.uid) {
			return <Redirect to="/signin" />;
		}
		this.myFunc();
		console.log(this.state)
		
	// console.log(tickers)
	// db.collection("transctions")
	//   .onSnapshot(function(querySnapshot) {
	//   querySnapshot.forEach(function(doc) {
	//     totalVal += (doc.data().numberOfShares * doc.data().price);
	// });

	return(
      <div>
	{/* <h1>{totalVal}</h1> */ }
      </div >
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