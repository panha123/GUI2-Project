import React, { Component, Fragment } from 'react'
import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";
import { compose } from "redux";
import { Redirect } from "react-router-dom";
import firebase from 'firebase/app';
const alpha = require('alphavantage')({ key: "LQGPQG13311MZSX7" });

export class Holdings extends Component {

	state = {tickers:null};

	componentWillMount = () => {
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
				// alpha.data.quote(key, "json").then( data =>{
				// 	let curPrice = Number(data["Global Quote"]["05. price"]);
				// 	this.state.tickers[key].currentPrice = curPrice.toFixed(2);
				// })


			}
			
		})
		.catch(function(error) {
            console.log("Error getting document:", error);
		});  
		
	}
	// myFunc() {
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
	render() {
		const { auth } = this.props;
		let valToDisplay ;
		if (!auth.uid) {
			return <Redirect to="/signin" />;
		}
		if (this.state.tickers === null) {
		// 	// Render loading state ...
			return (<div><h1>empty</h1></div>)
		} 
		// else {
			// Render real UI ...

			let ticks = this.state.tickers;
			// let a = []
			// for( const [key,value] of Object.entries(ticks) ){
			// 	a.push(ticks[key])
			// }
			valToDisplay = Object.keys(ticks).map( key => { return {tick: key, val: ticks[key]}})
			// console.log(a)
			// return for( const [key,value] of Object.entries(ticks) ){}
			// return



			// )
		
		
		// }	
		let a = JSON.stringify(valToDisplay)

		let b  = JSON.parse(a);

		let c = b.replace(/"/gi, '');

		
		console.log(c)
		return <div>

			 */}



			</div>
		
      
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