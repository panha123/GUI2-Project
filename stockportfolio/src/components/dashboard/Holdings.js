import React, { Component } from 'react'
import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";
import { compose } from "redux";
import { Redirect } from "react-router-dom";

export class Holdings extends Component {
    
    render() {
        const { auth } = this.props;
        if (!auth.uid) {
            return <Redirect to="/signin" />;
        }
        return (
        <div>
           <h1>HOLDINGS</h1>
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