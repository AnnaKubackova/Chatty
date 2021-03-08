import firebase from "firebase/app";
import { groupConstant } from "./constant"

export const createGroup = (groupInfo) => {
    return async dispatch => {
        dispatch({ type: `${groupConstant.CREATE_GROUP}_REQUEST` });

        const db = firebase.firestore();
        var ids = [];
        console.log("groupInfo.groupMembers.length: ", groupInfo.groupMembers.length)
        for (let a = 0; a < groupInfo.groupMembers.length; a++) {
            ids.push(groupInfo.groupMembers[a]);
        }

        db.collection('groupchats')
        .add({
            members: groupInfo.groupMembers,
            groupname: groupInfo.groupname,
            user_from: '',
            message: '',
            isSeen: false,
            createdAt: new Date(),
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

        console.log("group id - clicked: ", group.groupId);

        db.collection('groupchatsmassages')
        .where('group_to', '==', group.groupId)
        .orderBy('createdAt', 'asc')
        .onSnapshot((querySnapshot) => {
            const groupMessages = [];
            querySnapshot.forEach(doc => {
                groupMessages.push(doc.data()); 
                               
                if(groupMessages.length > 0) {
                    dispatch({
                        type:  groupConstant.GROUP_MESSAGES,
                        payload: { messages: groupMessages }
                    })
                } else {
                    dispatch({
                        type:  `${groupConstant.GROUP_MESSAGES}_FAILURE`
                    })
                }
                
            })
        })
    }
}

export const updateGroupMessage = (message) => {
    return async dispatch => {
        console.log("updateGroupMessage function fires and this is the groupmessage: ", message)
        
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
    return async dispatch => {
        let members = [];

        const db = firebase.firestore();
        var docRef = db.collection("groupchats").doc(groupId);

        docRef.get().then((doc) => {
            if (doc.exists) {
                for (let u = 0; u < doc.data().members.length; u++) {
                    members.push(doc.data().members[u]);
                }
                console.log("Members:", members);
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        });

    }
}