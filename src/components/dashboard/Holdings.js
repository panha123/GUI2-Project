import React, { Component } from 'react'
import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";
import { compose } from "redux";
import { Redirect } from "react-router-dom";
import firebase from 'firebase/app';

export class Holdings extends Component {
    
  render() {
      const { auth } = this.props;
      if (!auth.uid) {
          return <Redirect to="/signin" />;
      }

      const db = firebase.firestore();
      const uid =firebase.auth().currentUser.uid;
      const collectionRef = db.collection(`user`).doc(uid).collection(`transactions`);
      const subcollection = [];
      let tickers = {};
      let unique = [];

      collectionRef.onSnapshot(querySnapshot => {
        querySnapshot.forEach( doc => {
          let obj = doc.data();
          subcollection.push(obj.ticker);
          


        })
        unique = [...new Set(subcollection)];
        unique.forEach( n => {
          let key = n.valueOf();
          tickers[key] = { totalShares: 0 };
        })
      })

      collectionRef.where("transactionType", "==", "buy")
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach( doc => {
          let obj = doc.data();
          let key = obj.ticker;
          let value = Number(obj.sharesAvailable);
          if ( key in tickers ){
            let total = tickers[key].totalShares;

            total += value;

            tickers[key].totalShares = total;
          }
          console.log(tickers)

        })
      })

      // db.collection("transctions")
      //   .onSnapshot(function(querySnapshot) {
      //   querySnapshot.forEach(function(doc) {
      //     totalVal += (doc.data().numberOfShares * doc.data().price);
      // });

      return (
      <div>
          {/* <h1>{totalVal}</h1> */}
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