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
                    if (doc.data().uid !== uid) {
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

        return unsubscribe;
    }
}

export const setNewPersonToChat = (user) => {
    return async dispatch => {
        dispatch({
            type: `${userConstant.SET_NEWPERSON}_REQUEST`
        });

        if (user) {
            dispatch({
                type: `${userConstant.SET_NEWPERSON}_SUCCESS`,
                payload: {
                    user
                }
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
        const db = firebase.firestore();
        db.collection('messages')
            .add({
                ...messageObj,
                isSeen: false,
                createdAt: new Date()
            })
    }
}

export const getMessages = (user) => {
    return async dispatch => {
        dispatch({
            type: `${userConstant.GET_MESSAGE}_REQUEST`
        })

        const messages = [];

        const db = firebase.firestore();
        const currentUser = firebase.auth().currentUser;
        db.collection('messages')
            .where('user_from', 'in', [`${user.uid}`, `${currentUser.uid}`])
            .orderBy('createdAt', 'asc')
            .onSnapshot({ includeMetadataChanges: true }, (querySnapshot) => {
                
                querySnapshot.docChanges().forEach((change) => {
                    if (change.type === "added") {
                        if (
                        //messages user sent
                        (change.doc.data().user_from === currentUser.uid && change.doc.data().user_to === user.uid) ||
                        //messages user recieved 
                        (change.doc.data().user_from === user.uid && change.doc.data().user_to === currentUser.uid)
                        ) {
                            messages.push(change.doc.data());
                        }

                        if (messages.length > 0) {
                            dispatch({
                                type: userConstant.GET_MESSAGE,
                                payload: {
                                    messages: messages
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
                    }
                })
            })

            db.collection('messages')
                .where('user_from', '==', `${user.uid}`)
                .where('user_to', '==', `${currentUser.uid}`)
                .get()
                .then(function (querySnapshot) {                
                    querySnapshot.forEach(function(doc) {
                        doc.ref.update({
                            isSeen: true
                        })
                                                       
                    });
                })
                .then(() => {
                    dispatch({
                        type: userConstant.GET_UNSEENMESSAGES,
                        payload: {
                            unseen: 0
                        }
                    })
                });
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
                let chatUsers = sessionStorage.getItem('chatUsers');
                if (chatUsers !== null) {
                    chats.push(chatUsers);
                    sessionStorage.removeItem('chatUsers');
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
        if(ids[0]) {
            for (let a = 0; a < ids[0].length; a++) {
                db.collection("users")
                    .doc(ids[0][a])
                    .onSnapshot((doc) => {
                        chatUsers.push(doc.data());

                        if (chatUsers.length > 0) {
                            dispatch({
                                type: `${userConstant.GET_CHATUSERS}_REQUEST`,
                                payload: {
                                    users: chatUsers
                                }
                            });
                        }
                    });
            }
        }
        
    }
}

export const searchUserName = (searchQuery) => {
    return async dispatch => {
        let allUsers = [];
        let users = [];
        const currentUserId = firebase.auth().currentUser.uid;

        const db = firebase.firestore();
        db.collection("users")
            .onSnapshot((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    if (doc.data().uid !== currentUserId) {
                        allUsers.push(doc.data());
                    }

                });

                for (let a = 0; a < allUsers.length; a++) {
                    if (allUsers[a].firstName.toLowerCase().includes(searchQuery) || allUsers[a].lastName.toLowerCase().includes(searchQuery))
                        users.push(allUsers[a]);
                }

                dispatch({
                    type: `${userConstant.SEARCH}_SUCCESS`,
                    payload: {
                        users
                    }
                })
            });

    }
}

export const fetchUnseenMessages = () => {
    return async dispatch => {
        const db = firebase.firestore();
        const currentUser = firebase.auth().currentUser;
        const unSeenMessages = [];
        console.log('before snapshot: ', unSeenMessages);
        db.collection('messages')
        .where('user_to', '==', `${currentUser.uid}`)
        .where('isSeen', '==', false)
        .onSnapshot({ includeMetadataChanges: true }, (querySnapshot) => {
                
                querySnapshot.docChanges().forEach((change) => {
                    if (change.type === "added") {
                        {
                            unSeenMessages.push(change.doc.data());
                        }
                            dispatch({
                                type: userConstant.GET_UNSEENMESSAGES,
                                payload: {
                                    unseen: unSeenMessages.length
                                }
                            })
                    }
                })
            })
    }
}