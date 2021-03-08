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
    return async () => {
        console.log("getGroupMessages function fires and this is the group: ", group);
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