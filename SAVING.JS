export const getMessageCollection = (uid) => {
    return async dispatch => {
        console.log("uid: ", uid);
        const db = firebase.firestore();
        db.collection('messages')
            .orderBy('createdAt', 'asc')
            .onSnapshot((querySnapshot) => {
                const chats = [];
                const unique =[];
                querySnapshot.forEach(doc => {
                    if (doc.data().user_from == uid || doc.data().user_to == uid) {
                        chats.push(doc.data());
                        console.log("chats: ", chats);

                        let ids = [];
                        for (let b = 0; b < chats.length; b++) {
                            if(chats[b].user_to == uid) {
                                console.log("user from: ", chats[b].user_from);
                                ids.push(chats[b].user_from);
                            } else if(chats[b].user_from == uid) {
                                console.log("user to: ", chats[b].user_to);
                                ids.push(chats[b].user_to);
                            }                           
                        }

                        console.log("all ids: ", ids);

                        const uniqueids = [];
                        ids.map(item => {
                            var findid = uniqueids.find(x => x === item);
                            if (!findid) 
                            uniqueids.push(item)
                            
                        })

                        console.log("all unique ids: ", uniqueids);

                        unique.push("hello");

                        console.log("unique ids after push: ", unique);                       
                    }

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
            })
    }
}