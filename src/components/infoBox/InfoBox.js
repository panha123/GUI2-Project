import React, { Component } from 'react';
import firebase from 'firebase/app';
import {MarketVal} from '../marketVal/MarketVal';
import {YTDGain} from '../ytdGain/YTDGain';


export class InfoBox extends Component {

    componentDidMount = () => {
        const db = firebase.firestore();
        const docRef = db.collection('user').doc(firebase.auth().currentUser.uid);
        docRef.get().then((doc) => {
            if (doc.exists) {
                this.setState(doc.data());
            } else {
                console.log("No such document!");
            }
        }).catch(function(error) {
            console.log("Error getting document:", error);
        });    
    }

    render() {
        return (
            <div>
                <MarketVal />
                <YTDGain />
                <div className="InfoBox row center">
                    <div className="col s6">YTD Taxes: </div>
                    <div className="col s6" id="ytdTaxes">0</div>
                </div>
            </div>
        )
    }
}