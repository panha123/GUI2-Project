import React, { Component } from 'react'
import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";
import { compose } from "redux";
import firebase from 'firebase/app';

export class MarketVal extends Component {
  state = {
    totalVal: 0
  }

    componentDidMount() {
      const db = firebase.firestore();
      const uid =firebase.auth().currentUser.uid;

      db.collection(`user/${uid}/transactions`).onSnapshot((querySnapshot) => {
        let total = 0;;
          querySnapshot.forEach((doc) => {
            if (doc.data().transactionType === "buy"){
              total += (doc.data().price * doc.data().numberOfShares);
            }
            else {
              total -= (doc.data().price * doc.data().numberOfShares);
            }
  
           });
  
          this.setState({
              totalVal: total
          });
      });    
  }
    render() {
        return (
           <div className="InfoBox row center">
                    <div className="col s6"><h5><strong>Market Value: </strong></h5> </div>
                    <div className="col s6" id="marketValue"><h5>{this.state.totalVal}</h5></div>
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
    firestoreConnect([{ collection: "transactions" }])
  )(MarketVal);