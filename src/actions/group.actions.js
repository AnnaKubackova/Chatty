import firebase from "firebase/app";
import { groupConstant } from "./constant"

export const createGroup = (groupInfo) => {
    return async dispatch => {
        dispatch({ type: `${groupConstant.CREATE_GROUP}_REQUEST` });

        const db = firebase.firestore();
        var ids = [];

        for (let a = 0; a < groupInfo.groupMembers.length; a++) {
            ids.push(groupInfo.groupMembers[a]);
        }

        db.collection('groupchats')
        .add({
            members: groupInfo.groupMembers,
            groupname: groupInfo.groupname,
            createdAt: new Date()
        })
        .then((docRef) => {
            db.collection('groupchats')
            .doc(docRef.id)
            .update({
                groupId: docRef.id
            })

            dispatch({
                type: groupConstant.CREATE_GROUP,
                payload: { groupInfo: groupInfo, groupId: docRef.id }
            })
        })
        .catch(error => {
            console.log(error)
        })
    }
}

export const getGroupList = (uid) => {
    return async dispatch => {
        dispatch({ type: `${groupConstant.GET_GROUPLIST}_REQUEST` });

        const db = firebase.firestore();
        db.collection('groupchats')
        .where('members', 'array-contains', uid)
        .onSnapshot((querySnapshot) => {
            const grouplist =[];
            querySnapshot.forEach(doc => {
                grouplist.push(doc.data());
            })

            if (grouplist.length > 0) {
                dispatch({
                    type: `${groupConstant.GET_GROUPLIST}_SUCCESS`,
                    payload: {
                        grouplist
                    }
                })
            } else {
                dispatch({
                    type: `${groupConstant.GET_GROUPLIST}_FAILURE`
                })
            }
        })
    }
}

export const getGroupMessages = (group) => {
    return async dispatch => {
        const db = firebase.firestore();
        const groupMessages = [];

        db.collection('groupchatsmassages')
        .where('group_to', '==', group.groupId)
        .orderBy('createdAt', 'asc')
        .onSnapshot((querySnapshot) => {
            querySnapshot.forEach(doc => {
                groupMessages.push(doc.data()); 
                            
                dispatch({
                    type:  `${groupConstant.GROUP_MESSAGES}_SUCCESS`,
                    payload: { messages: groupMessages }
                })
            })
        })

        if(groupMessages.length === 0) {
            dispatch({
                type:  `${groupConstant.GROUP_MESSAGES}_FAILURE`,
                payload: { messages: groupMessages }
            })
        }
    }
}

export const updateGroupMessage = (message) => {
    return async dispatch => {        
        const db = firebase.firestore();
        db.collection('groupchatsmassages')
        .add({
            ...message,
            createdAt: new Date()
        })
        .then(() => {
            dispatch({
                type: `${groupConstant.NEW_MESSAGE}_SENT`,
                payload: { message }
            })
        })
        .catch(error => {
            console.log(error)
        })
    }
}

export const getGroupMembers = (groupId) => {
    return dispatch => {
        let members = [];
        let membersList = [];

        const db = firebase.firestore();
        db.collection("groupchats")        
        .onSnapshot((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                if (doc.data().groupId === groupId) {
                    members.push(doc.data().members);
                }
            });
        })
        
        
        db.collection("users")
        .onSnapshot((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                for (let c = 0; c < members[0].length; c++) {
                    if (doc.data().uid === members[0][c]) {
                        membersList.push(doc.data());
                    }
                }
            })
            
            if (membersList.length > 0) {
                dispatch({
                    type:  groupConstant.GROUP_MEMBERS,
                    payload: { membersList }
                });
            } else {
                dispatch({
                    type:  `${groupConstant.GROUP_MEMBERS}_FAILURE`,
                    payload: { membersList }
                });
            }
        })
    }
}