export const isUserLoggedIn = () => {
    return async dispatch => {
        const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
        const db = firebase.firestore();

        const checkUserInfo = db.collection("users").doc(user.uid)
        .onSnapshot((doc) => {
            const userInfo = doc.data();
            console.log(userInfo);           
        });

        console.log("this is checkUserInfo: ", checkUserInfo);
        return checkUserInfo;    
    }
}    