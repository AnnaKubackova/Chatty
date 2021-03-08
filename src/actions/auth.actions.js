import firebase from "firebase/app";
import 'firebase/storage';
import { authConstant } from "./constant";

export const signup = (user) => {
    return async (dispatch) => {
        const db = firebase.firestore();

        dispatch({ type: `${authConstant.USER_LOGIN}_REQUEST` });

        firebase.auth()
        .createUserWithEmailAndPassword(user.email, user.password)
        .then(data => {
            const currentUser = firebase.auth().currentUser;
            const name = `${user.firstName} ${user.lastName}`;
            const image = `${user.image}`;
            console.log(image);
            currentUser.updateProfile({
                displayName: name,
                photoURL: image
            })
            .then(() =>{
                db.collection('users')
                .doc(data.user.uid)
                .set({
                    firstName: user.firstName,
                    lastName: user.lastName,
                    uid: data.user.uid,
                    createdAt: new Date(),
                    isOnline: true,
                    image: user.image
                })
                .then(() => {
                    const loggedInUser = {
                        firstName: user.firstName,
                        lastName: user.lastName,
                        uid: data.user.uid,
                        email: user.email,
                        image: user.image
                    }
                    localStorage.setItem('user', JSON.stringify(loggedInUser));
                    console.log('User logged in');
                    dispatch({
                        type: `${authConstant.USER_LOGIN}_SUCCESS`,
                        payload: { user: loggedInUser }
                    });
                })
                .catch(error =>{
                    console.log(error);
                    dispatch({ 
                        type: `${authConstant.USER_LOGIN}_FAILURE`,
                        payload: { error }
                    });
                });
            });
        })
        .catch(error => {
            console.log(error);
        })
    }
}

export const sigin = (user) => {
    return async dispatch => {
        dispatch({ type: `${authConstant.USER_LOGIN}_REQUEST`});
        firebase.auth()
        .signInWithEmailAndPassword(user.email, user.password)
        .then((data) => {
            const db = firebase.firestore();
            db.collection("users")
            .doc(data.user.uid)
            .update({
                isOnline: true
            })
            .then(() => {
                const name = data.user.displayName.split(" ");
                const image = data.user.photoURL;
                const firstName = name[0];
                const lastName = name[1];
                const loggedInUser = {
                    firstName,
                    lastName,
                    image,
                    uid: data.user.uid,
                    email: data.user.email
                }
                console.log("livecheck: ", loggedInUser);
                localStorage.setItem('user', JSON.stringify(loggedInUser));

                dispatch({
                    type: `${authConstant.USER_LOGIN}_SUCCESS`,
                    payload: { user: loggedInUser }
                });
            })
            .catch(error => {
                console.log(error)
            })            
        })
        .catch(error => {
            console.log(error);
            dispatch({
                type: `${authConstant.USER_LOGIN}_FAILURE`,
                payload: { error }
            })
        })
    }
}

export const signInWithGoogle = () => {
    return async dispatch => {
        dispatch({ type: `${authConstant.GOOGLEUSER_LOGIN}_REQUEST`});
        const db = firebase.firestore();
        const googleProvider = new firebase.auth.GoogleAuthProvider()
        firebase.auth().signInWithPopup(googleProvider)
        .then((data) => {
            console.log("this is the google uid: ", data.user.uid);
            const name = data.user.displayName.split(" ");
            const image = data.user.photoURL;
            const firstName = name[0];
            const lastName = name[1];
            db.collection('users')
            .doc(data.user.uid)
            .set({
                firstName,
                lastName,
                uid: data.user.uid,
                createdAt: new Date(),
                isOnline: true,
                image   
            })
            .then(() => {
                const loggedInUser = {
                    firstName,
                    lastName,
                    uid: data.user.uid,
                    email: data.user.email,
                    image
                }
                localStorage.setItem('user', JSON.stringify(loggedInUser));
                console.log('User logged in');

                dispatch({
                    type: `${authConstant.GOOGLEUSER_LOGIN}_SUCCESS`,
                    payload: { user: loggedInUser }
                });

                console.log("after dispatching logged in user");
            })
            .catch((error) => {
                console.log(error)
            })
            .catch(error => {
                console.log(error);
                dispatch({
                    type: `${authConstant.GOOGLEUSER_LOGIN}_FAILURE`,
                    payload: { error }
                })
            })
        })
    }
}


export const isUserLoggedIn = () => {
    return async dispatch => {
        const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;

        if(user) {
            const db = firebase.firestore();

            const checkUserInfo = db.collection("users").doc(user.uid)
            .onSnapshot((doc) => {
                const userInfo = doc.data();

                localStorage.setItem('user', JSON.stringify(userInfo));

                dispatch({
                    type: `${authConstant.USER_LOGIN}_SUCCESS`,
                    payload: { user: userInfo }
                })       
            });

            console.log("this is checkUserInfo: ", checkUserInfo);
            return checkUserInfo; 

            
        } else {
            dispatch({
                type: `${authConstant.USER_LOGIN}_FAILURE`,
                payload: { error: 'Log in again' }
            })
        }
    }
}

export const logout = (uid) => {
    return async dispatch => {
        dispatch({ type: `${authConstant.USER_LOGOUT}_REQUEST` });
        
        const db = firebase.firestore();
        db.collection("users")
        .doc(uid)
        .update({
            isOnline: false
        })
        .then(() => {
            firebase.auth()
            .signOut()
            .then(() => {
                localStorage.clear();
                dispatch({ type: `${authConstant.USER_LOGOUT}_SUCCESS` });
            })
            .catch(error => {
                console.log(error);
                dispatch({ 
                    type: `${authConstant.USER_LOGOUT}_FAILURE`,
                    payload: { error }
                });
            })
        })
        .catch(error => {
            console.log(error);
        })
    }
}

export const updateInfo = (user) => {
    return async dispatch => {
        const db = firebase.firestore();

        dispatch({ type: `${authConstant.UPDATE_PROFILE}_REQUEST`});
        
        const currentUser = firebase.auth().currentUser;

        const localStorageUser = JSON.parse(localStorage.getItem('user'));        
        var newFirstName;
        var newLastName;
        var newImage;

        if(!user.firstName) {
            newFirstName = localStorageUser.firstName
        } else {
            newFirstName = user.firstName
        }

        if(!user.lastName) {
            newLastName = localStorageUser.lastName
        } else {
            newLastName = user.lastName
        }

        const name = `${newFirstName} ${newLastName}`;

        if(!user.uploadedImage) {
            const image = localStorageUser.image

            currentUser.updateProfile({
                displayName: name,
                photoURL: image
            })
            .then(() =>{
                db.collection('users')
                .doc(currentUser.uid)
                .update({
                    firstName: newFirstName,
                    lastName: newLastName,
                    image: image
                })
                .then(() => {
                    const loggedInUser = {
                        firstName: newFirstName,
                        lastName: newLastName,
                        image: image,
                        uid: currentUser.uid,
                        email: currentUser.email
                    }
                    localStorage.setItem('user', JSON.stringify(loggedInUser));

                    dispatch({
                        type: `${authConstant.UPDATE_PROFILE}_SUCCESS`,
                        payload: { user: loggedInUser }
                    });
                })
                .catch(error =>{
                    console.log(error);
                    dispatch({ 
                        type: `${authConstant.UPDATE_PROFILE}_FAILURE`,
                        payload: { error }
                    });
                });
            })
            .catch(error => {
                console.log(error);
            }) 

        } else {
            newImage = user.uploadedImage

            // Uploading image to the storage
            var storageRef = firebase.storage().ref();
            var imageReference = storageRef.child('images/' + currentUser.uid + newImage.name);

            imageReference.put(newImage).then(() => {
                //Updating data
                var storage = firebase.storage();
                storage.refFromURL(imageReference).getDownloadURL()
                .then((url) => { 
                    console.log("URL: ", url);
                    const image = `${url}`;
    
                    currentUser.updateProfile({
                        displayName: name,
                        photoURL: image
                    })
                    .then(() =>{
                        db.collection('users')
                        .doc(currentUser.uid)
                        .update({
                            firstName: newFirstName,
                            lastName: newLastName,
                            image: url
                        })
                        .then(() => {
                            const loggedInUser = {
                                firstName: newFirstName,
                                lastName: newLastName,
                                image: url,
                                uid: currentUser.uid,
                                email: currentUser.email
                            }
                            localStorage.setItem('user', JSON.stringify(loggedInUser));
    
                            dispatch({
                                type: `${authConstant.UPDATE_PROFILE}_SUCCESS`,
                                payload: { user: loggedInUser }
                            });
                        })
                        .catch(error =>{
                            console.log(error);
                            dispatch({ 
                                type: `${authConstant.UPDATE_PROFILE}_FAILURE`,
                                payload: { error }
                            });
                        });
                    })
                    .catch(error => {
                        console.log(error);
                    }) 
                });
            });       
        }
    }
}

export const deleteUser = (uid) => {
    return async dispatch => {
        dispatch({ type: `${authConstant.USER_DELETE}_REQUEST` });
        
        const db = firebase.firestore();

        db.collection("users")
        .doc(uid)
        .delete()
        .then(() => {
            var user = firebase.auth().currentUser;
            user.delete().then(function() {
                console.log("deleted from authentication");
              }).catch(function(error) {
                console.log("NOT deleted from authentication", error);
              });
              
            localStorage.clear();
            dispatch({ type: `${authConstant.USER_DELETE}_SUCCESS` });
            console.log("Document successfully deleted!");
        }).catch((error) => {            
            dispatch({ 
                type: `${authConstant.USER_DELETE}_FAILURE`,
                payload: { error }
            });
        });
    }
}