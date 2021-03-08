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
                if (doc.data().uid !== uid) {
                    users.push(doc.data());
                }                
            });
            console.log('users: ', users);
            dispatch({ 
                type: `${userConstant.GET_ONLINE_USERS}_SUCCESS`,
                payload: { users }
            })
        });

        return unsubscribe;        
    }
}

export const setNewPersonToChat = (user) => {
    return async dispatch => {
        dispatch({ type: `${userConstant.SET_NEWPERSON}_REQUEST` });

        if (user) {
            dispatch({ 
                type: `${userConstant.SET_NEWPERSON}_SUCCESS`,
                payload: { user }
            })
        } else {
            dispatch({ 
                type: `${userConstant.SET_NEWPERSON}_FAILURE`
            })
        }
    }
}

export const updateMessage = (messageObj) => {
    return async dispatch => {
        console.log(messageObj);
        const db = firebase.firestore();
        db.collection('messages')
        .add({
            ...messageObj,
            isSeen: false,
            createdAt: new Date()
        })
        .then((data) => {
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
        dispatch({ type:  `${userConstant.GET_MESSAGE}_REQUEST` })
        const db = firebase.firestore();

        const currentUser = firebase.auth().currentUser; 
        console.log("user id - clicked: ", user.uid);
        console.log("user id - currentuser: ", currentUser.uid);

        db.collection('messages')
        .where('user_from', 'in', [`${user.uid}`, `${currentUser.uid}`])
        .orderBy('createdAt', 'asc')
        .onSnapshot((querySnapshot) => {
            const messages = [];
            querySnapshot.forEach(doc => {
                if(
                    //messages user sent
                    (doc.data().user_from === currentUser.uid && doc.data().user_to === user.uid)
                    ||
                    //messages user recieved 
                    (doc.data().user_from === user.uid && doc.data().user_to === currentUser.uid)
                ) {
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
        })
    }
}

export const getMessageCollection = (uid) => {
    return async dispatch => {
        const db = firebase.firestore();
        db.collection('messages')
        .orderBy('createdAt', 'asc')
        .onSnapshot((querySnapshot) => {
            const chats = [];
            const unique = [];
            let chatUsers = localStorage.getItem('chatUsers');
            if(chatUsers !== null){
                chats.push(chatUsers);
                localStorage.removeItem('chatUsers');
            }

            querySnapshot.forEach(doc => {
                if (doc.data().user_from === uid) {
                    chats.push(doc.data().user_to);
                } else if (doc.data().user_to === uid) {
                    chats.push(doc.data().user_from);
                }
            })

            let uniqueids = chats.filter((item, i, ar) => ar.indexOf(item) === i);
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
                    type: `${userConstant.GET_CHAT}_FAILURE`
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