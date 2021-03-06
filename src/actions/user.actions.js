import firebase from "firebase/app";
import { userConstant } from "./constant"

export const getOnlineUsers = (uid) => {
    return async (dispatch) => {
        dispatch({ type: `${userConstant.GET_ONLINE_USERS}_REQUEST` });
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
                payload: { users }
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
                type: userConstant.GET_NEWMESSAGE
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

        const currentUser = firebase.auth().currentUser; 
        console.log("user id - clicked: ", user.uid);
        console.log("user id - currentuser: ", currentUser.uid);

        db.collection('messages')
        .where('user_to', 'in', [user.uid, currentUser.uid])
        .orderBy('createdAt', 'asc')
        .onSnapshot((querySnapshot) => {
            const messages = [];
            querySnapshot.forEach(doc => {
                if (doc.data()) {
                    messages.push(doc.data()); 
                }
                               
                if(messages.length > 0) {
                    dispatch({
                        type:  userConstant.GET_MESSAGE,
                        payload: { messages: messages }
                    })
                } else {
                    dispatch({
                        type:  `${userConstant.GET_MESSAGE}_FAILURE`,
                        payload: { messages }
                    })
                }
                
            })
            console.log("messages: ", messages);
        })
    }
}

export const getMessageCollection = (uid) => {
    return async dispatch => {
        console.log("uid: ", uid);
        const db = firebase.firestore();
        db.collection('messages')
        .orderBy('createdAt', 'asc')
        .onSnapshot((querySnapshot) => {
            const chats = [];
            const unique = [];
            querySnapshot.forEach(doc => {
                if (doc.data().user_from == uid) {
                    chats.push(doc.data().user_to);
                } else if (doc.data().user_to == uid) {
                    chats.push(doc.data().user_from);
                }
            })

            let uniqueids = chats.filter((item, i, ar) => ar.indexOf(item) === i);
            console.log("chats: ", uniqueids);
            unique.push(uniqueids);

            if (unique.length > 0) {
                dispatch({
                    type: userConstant.GET_CHAT,
                    payload: {
                        unique
                    }
                })
            } else {
                dispatch({
                    type: `${userConstant.GET_CHAT}_FAILURE`,
                    payload: {
                        unique
                    }
                })
            }
        })
    }
}

export const getChatUsers = (ids) => {
    return async dispatch => {
        const chatUsers = [];

        const db = firebase.firestore();
        for (let a = 0; a < ids[0].length; a++) {
            console.log('here are you ids:', ids[0][a]);

            db.collection("users")
            .doc(ids[0][a])
            .onSnapshot((doc) => {
                chatUsers.push(doc.data());

                if(chatUsers.length > 0){
                    dispatch({ 
                    type: `${userConstant.GET_CHATUSERS}_REQUEST`,
                    payload: { users: chatUsers }
                    }); 
                }
            });
        }


    }        
}
