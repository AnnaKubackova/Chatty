import firebase from "firebase/app";
import {
    userConstant
} from "./constant"

export const getOnlineUsers = (uid) => {
    return async (dispatch) => {
        dispatch({
            type: `${userConstant.GET_ONLINE_USERS}_REQUEST`
        });
        const db = firebase.firestore();

        const unsubscribe = db.collection("users")
            .onSnapshot((querySnapshot) => {
                var users = [];
                querySnapshot.forEach((doc) => {
                    if (doc.data().uid != uid) {
                        users.push(doc.data());
                    }
                });

                dispatch({
                    type: `${userConstant.GET_ONLINE_USERS}_SUCCESS`,
                    payload: {
                        users
                    }
                })
            });

        console.log("this is unsubscribe: ", unsubscribe);
        return unsubscribe;
    }
}

export const updateMessage = (messageObj) => {
    return async dispatch => {
        const db = firebase.firestore();
        db.collection('messages')
            .add({
                ...messageObj,
                isSeen: false,
                createdAt: new Date()
            })
            .then((data) => {
                console.log(data)
                dispatch({
                    type: userConstant.GET_MESSAGE
                })
            })
            .catch(error => {
                console.log(error)
            })
    }
}

export const getMessages = (user) => {
    return async dispatch => {
        const db = firebase.firestore();
        db.collection('messages')
            .where("user_from", "in", [user.user_from, user.user_to])
            .orderBy('createdAt', 'asc')
            .onSnapshot((querySnapshot) => {
                const messages = [];
                querySnapshot.forEach(doc => {
                    if (
                        //messages sent to the user
                        (doc.data().user_from == user.user_from && doc.data().user_to == user.user_to) ||
                        //messages recieved from user
                        (doc.data().user_from == user.user_to && doc.data().user_to == user.user_from)
                    ) {
                        messages.push(doc.data())
                    }

                    if (messages.length > 0) {
                        dispatch({
                            type: userConstant.GET_MESSAGE,
                            payload: {
                                messages
                            }
                        })
                    } else {
                        dispatch({
                            type: `${userConstant.GET_MESSAGE}_FAILURE`,
                            payload: {
                                messages
                            }
                        })
                    }

                })
                console.log("messages: ", messages);
            })
    }
}