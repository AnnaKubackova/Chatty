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
  const [chatStarted, setChatStarted] = useState(true);
  const [chatUser, setChatUser] = useState('');
  const [message, setMessage] = useState('');
  const [userToMessageUid, setuserToMessageUid] = useState('');
  let chats;
  let chatUsers;

  useEffect(() => {
    chats = dispatch(getMessageCollection(auth.uid))
    .then(chats => {
      return chats;
    })
    .catch(error => {
      console.log(error)
    })
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (chatUser === '') {
      if (user.newchatperson.length === 0) {
        setChatUser('')        
      } else {
        setChatUser(`${user.newchatperson.firstName} ${user.newchatperson.lastName}`)
      }      
    }

    chatUsers = dispatch(getChatUsers(user.chats))
    .then(chatUsers => {
      return chatUsers;
    })
    .catch(error => {
      console.log(error);
    })

    if (chatUser === `${user.newchatperson.firstName} ${user.newchatperson.lastName}`) {
      dispatch(getMessages(user.newchatperson));
    }
  }, [user.chats]); // eslint-disable-line react-hooks/exhaustive-deps

  const initChat = (user) => {
    setChatStarted(true);
    setChatUser(`${user.firstName} ${user.lastName}`);
    setuserToMessageUid(user.uid);
    dispatch(getMessages(user))
  }

  const sendMessage = (e) => {
    if (userToMessageUid === '') {
      var messageObj = {
        user_from: auth.uid,
        user_to: user.newchatperson.uid,
        message
      }
    } else {
      var messageObj = {
        user_from: auth.uid,
        user_to: userToMessageUid,
        message
      }
    }

    if (message !== "") {
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
              chatUser ? 
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
                <button 
                  disabled={ chatUser==='' ? true : false } 
                  onClick={sendMessage}
                >
                    Send
                </button>
              </div>
            : null
          }          
        </div>
      </RightSide>
    </div>
  )
}

export default ChatPage;