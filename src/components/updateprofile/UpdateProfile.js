import React, { Component } from 'react';
import firebase from 'firebase/app';
import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";
import { compose } from "redux";
import { Redirect } from "react-router-dom";

export class UpdateProfile extends Component {

    state = {
        firstName: '',
        lastName: '',
        email: '',
        income: '',
        filingstatus: '',
        dependents: ''
    }

    handleChange = (e) => {
        this.setState({
            [e.target.id] : e.target.value
        })
    }

    handleSubmit = (e) => {
        e.preventDefault();

        const uid = firebase.auth().currentUser.uid;
        const db = firebase.firestore();
        db.collection('user').doc(uid).update(this.state);
        this.props.history.push('/');
    }


    componentDidMount = () => {
        const db = firebase.firestore();
        const docRef = db.collection('user').doc(firebase.auth().currentUser.uid);
        docRef.get().then((doc) => {
            if (doc.exists) {
                console.log("foo");
                console.log(doc);
                this.setState(doc.data());
            } else {
                console.log("No such document!");
            }
        }).catch(function(error) {
            console.log("Error getting document:", error);
        });    
    }

    render() {
        const { auth } = this.props;

        if (!auth.uid) {
            return <Redirect to="/signin" />;
        }

        return (
            <div className="container z-depth-4 updateprofile">
                <form onSubmit={this.handleSubmit} className="white">
                    <h5 className="grey-text text-darken-3">Update Profile</h5>
                    <br/>
                    <div className="input-field">
                        <div><label htmlFor="firstName">First Name</label></div>
                        <div><input type="text" id="firstName"  value={this.state.firstName} onChange={this.handleChange}/></div>
                    </div>
                    <div className="input-field">
                        <div><label htmlFor="lastName">Last Name</label></div>
                        <div><input type="text" id="lastName"  value={this.state.lastName} onChange={this.handleChange}/></div>
                    </div>
                    <div className="input-field">
                        <div><label htmlFor="email">Email</label></div>
                        <div><input type="email" id="email" value={this.state.email} onChange={this.handleChange}/></div>
                    </div>
                    <div className="input-field">
                        <div><label htmlFor="income">Income</label></div>
                        <div><input type="number" min="0" id="income" value={this.state.income} onChange={this.handleChange}/></div>
                    </div>
                    <div className="input-field">
                        <div><label htmlFor="filingstatus">Filing Status</label></div>
                       <div><input type="text" id="filingstatus" value={this.state.filingstatus} onChange={this.handleChange}/></div>
                    </div>
                    <div className="input-field">
                        <div><label htmlFor="dependents">Number of Dependents</label></div>
                        <div><input type="number" min="0" id="dependents" value={this.state.dependents} onChange={this.handleChange}/></div>
                    </div>
                    <br/>
                    <div className="input-field"> 
                        <button className="waves-effect waves-light btn green left" >Submit</button>
                    </div>
                    <br/><br/><br/>
                </form>
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
  )(UpdateProfile);