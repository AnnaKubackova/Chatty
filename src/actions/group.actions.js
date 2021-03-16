import firebase from "firebase/app";
import {
    groupConstant
} from "./constant"

export const createGroup = (groupInfo) => {
    return async dispatch => {
        dispatch({
            type: `${groupConstant.CREATE_GROUP}_REQUEST`
        });

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
                    payload: {
                        groupInfo: groupInfo,
                        groupId: docRef.id
                    }
                })
            })
            .catch(error => {
                console.log(error)
            })
    }
}

export const getGroupList = (uid) => {
    return async dispatch => {
        dispatch({
            type: `${groupConstant.GET_GROUPLIST}_REQUEST`
        });

        const db = firebase.firestore();
        db.collection('groupchats')
            .where('members', 'array-contains', `${uid}`)
            .onSnapshot((querySnapshot) => {
                const grouplist = [];
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
        const groupMessages = [];
        const db = firebase.firestore();

        db.collection("groupchatsmassages")
        .where('group_to', '==', group.groupId)
        .orderBy('createdAt', 'asc')
        .onSnapshot({ includeMetadataChanges: true },(snapshot) => {
            snapshot.docChanges().forEach((change) => {
                if (change.type === "added") {
                    groupMessages.push(change.doc.data());

                    dispatch({
                        type: `${groupConstant.GROUP_MESSAGES}_SUCCESS`,
                        payload: {
                            messages: groupMessages
                        }
                    })
                }
                if (change.type === "modified") {
                    console.log("Modified: ", change.doc.data());
                }
            });

            if (groupMessages.length === 0) {
                dispatch({
                    type: `${groupConstant.GROUP_MESSAGES}_FAILURE`
                })
            }
        });

        const members = [];
        let membersList = [];

        db.collection('groupchats')
        .doc(group.groupId)
        .get()
        .then((doc) => {
            for(let b = 0; b < doc.data().members.length; b++) {
                 members.push(doc.data().members[b]);
            }
            console.log("TEST memebers[]: ", members);
            console.log("TEST memebers[] length: ", members.length);

            db.collection("users")
            .onSnapshot({ includeMetadataChanges: true }, (querySnapshot) => {
                querySnapshot.docChanges().forEach((change) => {
                    if (change.type === "added") {
                        for (let c = 0; c < members.length; c++) {
                            if (change.doc.data().uid === members[c]) {
                                membersList.push(change.doc.data());
                            }
                        }
                        console.log("added", change.doc.data())
                    }
                    if (change.type === "modified") {
                        console.log("Modified: ", change.doc.data());
                    }
                })

                if (membersList.length > 0) {
                    dispatch({
                        type: groupConstant.GROUP_MEMBERS,
                        payload: {
                            membersList
                        }
                    });
                } else {
                    dispatch({
                        type: `${groupConstant.GROUP_MEMBERS}_FAILURE`,
                        payload: {
                            membersList
                        }
                    });
                }
            })



        })
        .catch((error) => {
            console.log("error: ", error);
        })

       
    }
}

export const updateGroupMessage = (message) => {
    return async () => {
        const db = firebase.firestore();
        db.collection('groupchatsmassages')
            .add({
                ...message,
                createdAt: new Date()
            })
            .then((docRef) => {
                db.collection('groupchatsmassages')
                    .doc(docRef.id)
                    .update({
                        groupMessageId: docRef.id
                    })
            })
    }
}
