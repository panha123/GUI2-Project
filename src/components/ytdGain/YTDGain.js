import React, { Component } from 'react'
import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";
import { compose } from "redux";
import firebase from 'firebase/app';

export class YTDGain extends Component {
  state = {
    gains: 0
  }

    componentDidMount() {
      const db = firebase.firestore();
      const uid =firebase.auth().currentUser.uid;
      
      db.collection(`user/${uid}/transactions`).onSnapshot((querySnapshot) => {
        let gains = 0;
          querySnapshot.forEach((doc) => {
            let gain = 0;
            if (doc.data().transactionType === "sell"){
              gain = Number(doc.data().gain);
              gains += gain;

              this.setState({
                gains: gains.toFixed(2)
            });
            }
            
           }); 
      });    
  }
    render() {
        return (
           <div className="InfoBox row center">
                    <div className="col s6"><h5><strong>YTD Gains:</strong></h5></div>
                    <div className="col s6" id="ytdGain"><h5>{this.state.gains}</h5></div>
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
  )(YTDGain);