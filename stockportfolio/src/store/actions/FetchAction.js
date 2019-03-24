export const fetchUserProfile = () => {
    return(dispatch, getState, { getFirestore }) => {
        const firestore = getFirestore();
        const authorId = getState().firebase.auth.uid;

        
        firestore.collection('user').doc(authorId).get()
        .then((resp) => {
            // console.log(typeof resp.data());
            // return resp.data();
            
        })
        .catch( err => {
            console.log(err);
        })
    }
}
