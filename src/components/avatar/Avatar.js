import React, { Component } from 'react';
import firebase from 'firebase/app';
import Pika from '../../img/pika.jpg';
import { Redirect } from "react-router-dom";

export class Avatar extends Component {
    state = {
        firstName: '',
        lastName: '',
        email: '',
        income: '',
        filingstatus: '',
        dependents: '',
        redirect: false
    }
    setRedirect = () => {
        this.setState({
          redirect: true
        })
    }
    renderRedirect = () => {
        if (this.state.redirect) {
          return <Redirect to='/updateprofile' />
        }
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
            <img src={this.state.avatarURL} width="200" height="200"/>
            <br/>
            <div>
                {this.renderRedirect()}
                <button onClick={this.setRedirect}>Update Profile Picture</button>
            </div>
            <span id="UserName center">{this.state.email}</span>
          </div>
        )
    }
}