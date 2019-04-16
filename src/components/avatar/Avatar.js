import React, { Component } from 'react';
import firebase from 'firebase/app';
import { Redirect } from "react-router-dom";

export class Avatar extends Component {
    state = {
        firstName: '',
        lastName: '',
        email: '',
        income: '',
        filingStatus: '',
        dependents: '',
        redirect: false,
        avatarURL: 'https://firebasestorage.googleapis.com/v0/b/stockportfolio-23ecf.appspot.com/o/images%2Fdefault.jpeg?alt=media&token=c68bd22d-e430-4a13-9d7c-6f25276ece45'

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
                </div>
                <span id="UserName center red-text"><h4>{this.state.firstName} , {this.state.lastName}</h4></span>
            </div>
        )
    }
}