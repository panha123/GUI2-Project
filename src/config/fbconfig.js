import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

// initialize firebase
var config = {
    apiKey: "AIzaSyD0Y4g3lEMFpoj1HXxYGB8lGRJsAZ9zVeE",
    authDomain: "stockportfolio-23ecf.firebaseapp.com",
    databaseURL: "https://stockportfolio-23ecf.firebaseio.com",
    projectId: "stockportfolio-23ecf",
    storageBucket: "stockportfolio-23ecf.appspot.com",
    messagingSenderId: "578720090720"
};
firebase.initializeApp(config);
// firebase.firestore().settings({ timestampsInSnapshots: true });

export default firebase;