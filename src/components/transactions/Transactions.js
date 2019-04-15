import React, { Component } from 'react';
import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";
import { compose } from "redux";
import { Redirect } from "react-router-dom";
import firebase from 'firebase/app';


export default class Transactions extends Component {
    state = {
        ticker: '',
        date: '',
        transactionType: '',
        numberOfShares: 0,
        price: 0
    }


    handleClick = event => {
        const db = firebase.firestore();
        const uid = firebase.auth().currentUser.uid;
        const collectionRef = db.collection(`user`).doc(uid).collection(`transactions`);
        collectionRef.onSnapshot(querySnapshot => {
            querySnapshot.forEach( doc => {
                console.log(doc.data());
    
            })
          })
    }

    render() {
        
        return (
            <div>
                <input type="button" onLoad={this.handleClick} value="Button" />
            </div>
        )
    }
}
