import React, { Component } from 'react';
import firebase from 'firebase/app';
import Pika from '../../img/pika.jpg';


export class Avatar extends Component {
    state = {
        firstName: '',
        lastName: '',
        email: '',
        income: '',
        filingstatus: '',
        dependents: ''
    }

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
            <div className="ProfPic center">
            <img src={Pika} alt="Pika" width="200" height="200"/>
            <br/>
            <span id="UserName center">{this.state.email}</span>
          </div>
        )
    }
}