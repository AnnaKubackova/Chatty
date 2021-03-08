import firebase from "firebase/app";
import { groupConstant } from "./constant"

export const createGroup = (memberIds) => {
    return async dispatch => {
        dispatch({ type: `${groupConstant.CREATE_GROUP}_REQUEST` });

        const db = firebase.firestore();
        var ids = [];
        console.log("memberIds.length: ", memberIds.length)
        for (let a = 0; a < memberIds.length; a++) {
            ids.push(memberIds[a]);
        }
        console.log("ids: ", ids);

        db.collection('groupchats')
        .add({
            members: memberIds,
            user_from: '',
            message: '',
            isSeen: false,
            createdAt: new Date()
        })
        .then((data) => {
            dispatch({
                type: groupConstant.CREATE_GROUP,
                payload: { ids }
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
            const groups =[];
            querySnapshot.forEach(doc => {
                console.log("in here");
                groups.push(doc.data());
                console.log(groups);
                /* if (doc.data().members === uid) {
                    chats.push(doc.data().user_to);
                } else if (doc.data().user_to === uid) {
                    chats.push(doc.data().user_from);
                } */
            })



        /* const chats = [];
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
        } */
        })
    }
}