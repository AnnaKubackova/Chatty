import React, { useEffect, useState } from 'react';
import LeftSide from '../../components/LeftSide';
import RightSide from '../../components/RightSide'
import { useDispatch, useSelector } from 'react-redux'
import './style.css';
import { getMessages, getOnlineUsers, updateMessage, getMessageCollection, getChatUsers } from '../../actions';

const User = (props) => {
  const {user, getUserToChat} = props;
  
  return (
    <div onClick={() => getUserToChat(user)} className="user">
        <img src={user.image} alt="" />
        <p>{user.firstName} {user.lastName}</p>
    </div>
  )
}

const ChatPage = (props) => {
    const dispatch = useDispatch();
    const auth = useSelector(state => state.auth);
    const user = useSelector(state => state.user);
    const [chatStarted, setChatStarted] = useState(false);
    const [chatUser, setChatUser] = useState('');
    const [message, setMessage] = useState('');
    const [userToMessageUid, setuserToMessageUid] = useState(null);
    let chats;
    let chatUsers;

    useEffect(() => {
        chats = dispatch(getMessageCollection(auth.uid))
        .then(chats => {
            console.log("IN CHATPAGE THE CHAT:", user);
            return chats;
        })
        .catch(error => {
            console.log(error)
        })
    }, []);

    useEffect(() => {
        chatUsers = dispatch(getChatUsers(user.chats))
        .then(chatUsers => {
            console.log("chatusers: ", chatUsers);
            return chatUsers;
        })
        .catch(error => {
            console.log(error);
        })
    }, [user.chats]);


    const initChat = (user) => {
        setChatStarted(true);
        setChatUser(`${user.firstName} ${user.lastName}`);
        setuserToMessageUid(user.uid);

        dispatch(getMessages(user))
    }

    const sendMessage = (e) => {
      const messageObj = {
        user_from: auth.uid,
        user_to: userToMessageUid,
        message
      }

      if(message !== "") {
        dispatch(updateMessage(messageObj))
        .then(() => {
            setMessage('');
        })
      }
    }

    return (
      <div>
        <LeftSide >
          <section className="container allUsers">
            <div className="listOfUsers">
            {
              user.chatusers.length > 0 ?
              user.chatusers.map(user => {
                return(
                  <User 
                    getUserToChat={initChat}
                    key={user.uid} 
                    user={user} 
                  />
                );
              })
              :
              null
            }
            </div>
          </section>      
        </LeftSide>
        <RightSide>
          <div className="chatArea">
            <div className="chatHeader"> 
              {
                chatStarted ? chatUser : ''
              }
            </div>

            <div className="messageSections">
              {
                chatStarted ? 
                user.messages.map(msg => 
                  <div key={msg.createdAt}  style={{ textAlign: msg.user_from == auth.uid ? 'right' : 'left' }}>
                    <p className="messageStyle" >{msg.message}</p>
                  </div> 
                )            
                : null
              }
            </div>

              {
                chatStarted ?
                  <div className="chatControls">
                    <textarea 
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Write here"
                    />
                    <button onClick={sendMessage}>Send</button>
                  </div>
                : null
              }          
          </div>
        </RightSide>
      </div>
    )
}

export default ChatPage;