export const signIn = (credentials) => {
    return(dispatch, getState, {getFirebase}) => {
        const firebase = getFirebase();

        firebase.auth().signInWithEmailAndPassword(
            credentials.email,
            credentials.password
        ).then(() => {
            dispatch({type: 'LOGIN_SUCCESS'})
        }).catch((err) => {
            dispatch({type: 'LOGIN_ERROR', err})
        });
    }
}

export const signOut = (props) => {
    return (dispatch, getState, {getFirebase}) => {
        const firebase = getFirebase();

        firebase.auth().signOut().then(() => {
            dispatch({ type: 'SIGNOUT_SUCCESS' });
        });
    }
}

export const signUp = (newUser) => {
    return(dispatch, getState, { getFirebase, getFirestore }) => {
        const firebase = getFirebase();
        const firestore = getFirestore();

        firebase.auth().createUserWithEmailAndPassword(
            newUser.email,
            newUser.password
        ).then((resp) => {
            return firestore.collection('user').doc(resp.user.uid).set({
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                initials: newUser.firstName[0] + newUser.lastName[0],
                income: newUser.income,
                filingstatus: newUser.filingstatus,
                dependents: newUser.dependents
            })
        }).then(() => {
            dispatch({ type: 'SIGNUP_SUCCESS'}) // handled in authReducer.js
        }).catch( err => {
            dispatch({ type: 'SIGNUP_ERROR', err})
        })
    }
}

export const forgetPassword = (credentials) => {
    return(dispatch, getState, {getFirebase}) => {
        const firebase = getFirebase();

        firebase.auth().sendPasswordResetEmail(credentials.email).then( user => {
            alert("Please check your email");
        }).catch( e => {
            alert( e );
        })
    }
}