import React, { Component } from 'react';
import firebase from 'firebase/app';


export default class UpdateProfile extends Component {

    state = {
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        income: '',
        filingStatus: '',
        dependents: ''

    }

    handleChange = (e) => {
        this.setState({
            [e.target.id] : e.target.value
        })
    }

    handleSubmit = (e) => {
        e.preventDefault();

        const db = firebase.firestore();
        db.collection('user').doc(firebase.auth().currentUser.uid).update(this.state);
    }


    componentDidMount = () => {
        const db = firebase.firestore();
        const docRef = db.collection('user').doc(firebase.auth().currentUser.uid);
        console.log(firebase.auth().currentUser.uid);
        docRef.get().then((doc) => {
            if (doc.exists) {
                this.setState(doc.data());
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        }).catch(function(error) {
            console.log("Error getting document:", error);
        });    }

    render() {
        return (
            <div className="container">
                <form onSubmit={this.handleSubmit} className="white">
                    <h5 className="grey-text text-darken-3">Update Profile</h5>
                    <br/>
                    <div className="input-field">
                        <div><label htmlFor="firstName">First Name</label></div>
                        <div><input type="text" id="firstName"  value={this.state.firstName} onChange={this.handleChange}/></div>
                    </div>
                    <div className="input-field">
                        <label htmlFor="lastName">Last Name</label>
                        <input type="text" id="lastName"  value={this.state.lastName} onChange={this.handleChange}/>
                    </div>
                    <div className="input-field">
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" value={this.state.email} onChange={this.handleChange}/>
                    </div>
                    <div className="input-field">
                        <label htmlFor="password">Password</label>
                        <input type="password" id="password" onChange={this.handleChange}/>
                    </div>
                    <div className="input-field">
                        <label htmlFor="income">Income</label>
                        <input type="number" id="income" value={this.state.income} onChange={this.handleChange}/>
                    </div>
                    <div className="input-field">
                        <label htmlFor="filingstatus">Filing Status</label>
                        <input type="text" id="filingstatus" value={this.state.filingStatus} onChange={this.handleChange}/>
                    </div>
                    <div className="input-field">
                        <label htmlFor="dependents">Number of Dependents</label>
                        <input type="number" id="dependents" value={this.state.dependents} onChange={this.handleChange}/>
                    </div>
                    <div className="input-field"> 
                        <button className="btn light-blue lighten-1 z-depth-0">Submit</button>
                    </div>
                </form>
            </div>
        )
    }
  }