export const fetchUserProfile = (state) => {
    return(dispatch, getState, { getFirestore }) => {
        const firestore = getFirestore();
        const authorId = getState().firebase.auth.uid;

        
        firestore.collection('user').doc(authorId).get()
        .then((resp) => {
            console.log(typeof resp.data());

        })
        .catch( err => {
            console.log(err);
        })
    }
}
