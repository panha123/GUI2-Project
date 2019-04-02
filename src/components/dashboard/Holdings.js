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
        let totalVal = 0;
        db.collection("transctions")
          .onSnapshot(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
            totalVal += (doc.data().numberOfShares * doc.data().price);
        });


    });
        return (
        <div>
           <h1>{totalVal}</h1>
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