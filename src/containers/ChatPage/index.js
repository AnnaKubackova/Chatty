import React, { useEffect, useState, useRef } from 'react';
import LeftSide from '../../components/LeftSide';
import RightSide from '../../components/RightSide'
import { useDispatch, useSelector } from 'react-redux'
import './style.css';
import { getMessages, updateMessage, getMessageCollection, getChatUsers } from '../../actions';

const User = (props) => {
  const {user, getUserToChat} = props;
  
  return (
    <div onClick={() => getUserToChat(user)} className="user">
      <div className="userImage" style={{backgroundImage: `url(${user.image})`}}></div>
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
  const [userImage, setUserImage] = useState('');
  const [message, setMessage] = useState('');
  const [userToMessageUid, setuserToMessageUid] = useState('');
  const messageRef = useRef();
  let chats;
  let chatUsers;


  useEffect(() => {
    if(messageRef.current){
      messageRef.current.scrollIntoView(
        {
          block: 'end',
          inline: 'nearest'
        })
    }
  });

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
        setChatUser(`${user.newchatperson.firstName} ${user.newchatperson.lastName}`);
        setUserImage(user.newchatperson.image);
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
    setUserImage(user.image);
    setuserToMessageUid(user.uid);
    dispatch(getMessages(user));
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
        <section className="allUsers">
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
          {
            chatUser!=='' ? 
              <div className="chatHeader"> 
                <div className="userImage" style={{backgroundImage: `url(${userImage})`}}></div>
                <p>{chatUser}</p>  
              </div>            
            : null
          }
          
          <div className="messageSections">
            {
              chatUser ? 
              user.messages.map(msg => 
                <div key={msg.createdAt}  className={ msg.user_from === auth.uid ? 'rightMessage' : 'leftMessage' } ref={messageRef}>
                  <p className="messageStyle" >{msg.message}</p>
                  <p className="messageCreatedAt">{new Date(msg.createdAt.seconds * 1000 + msg.createdAt.nanoseconds / 1000000).toLocaleDateString('en-GB', {hour: '2-digit', minute: '2-digit'})}</p>
                </div> 
              )            
              : null
            }
          </div>

          <div className="chatControls">
            <textarea 
              disabled={ chatUser==='' ? true : false } 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => {
                if(e.key === 'Enter'){
                  sendMessage()
                }
              }}
              placeholder="Write here"
            />
            <button 
              disabled={ chatUser==='' ? true : false } 
              onClick={sendMessage}
            >
                Send
            </button>
          </div>
        </div>
      </RightSide>
    </div>
  )
}

export default ChatPage;