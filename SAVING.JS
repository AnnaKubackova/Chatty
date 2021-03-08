export const getGroupMembers = (groupId) => {
    return dispatch => {
        var membersList = [];

        const db = firebase.firestore();
        var docRef = db.collection("groupchats").doc(groupId);

        docRef.get().then((doc) => {
                for (let u = 0; u < doc.data().members.length; u++) {
                    db.collection("users")
                    .doc(doc.data().members[u])
                    .get()
                    .then((doc) => {
                        if (doc.exists) {
                            membersList.push(doc.data());
                        }
                    })
                }

                console.log(membersList.length);
                console.log(membersList);
                
                dispatch({
                    type:  groupConstant.GROUP_MEMBERS,
                    payload: { membersList }
                })
        }).catch((error) => {
            console.log("Error getting document:", error);
        });
    }
}