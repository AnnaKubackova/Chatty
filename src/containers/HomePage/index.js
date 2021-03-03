import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import './style.css';
import { useDispatch, useSelector } from 'react-redux'
import { getMessages, getOnlineUsers, updateMessage } from '../../actions';

const User = (props) => {
  const {user, getUserToChat} = props;

  return (
    <div onClick={() => getUserToChat(user)} className="displayName">
      <div className="displayPic">
        <img src="https://i.pinimg.com/originals/be/ac/96/beac96b8e13d2198fd4bb1d5ef56cdcf.jpg" alt="" />
      </div>
      <div style={{margin: '0 10px', flex: 1, display: 'flex', justifyContent: 'space-between'}}>
        <span style={{fontWeight: 500}}>{user.firstName} {user.lastName}</span>
        <span className={user.isOnline ? 'onlineStatus' : 'onlineStatus off'}></span>
      </div>
    </div>
  )
}

const HomePage = (props) => {
  const dispatch = useDispatch();
  const auth = useSelector(state => state.auth);
  const user = useSelector(state => state.user);
  const [chatStarted, setChatStarted] = useState(false);
  const [chatUser, setChatUser] = useState('');
  const [message, setMessage] = useState('');
  const [userToMessageUid, setuserToMessageUid] = useState(null);
  let unsubscribe;

  useEffect(() => {
    unsubscribe = dispatch(getOnlineUsers(auth.uid))
    .then(unsubscribe => {
      return unsubscribe;
    })
    .catch(error => {
      console.log(error)
    })
  }, []);

  useEffect(() => {
    return () => {
      unsubscribe.then(f => f()).catch(error => console.log(error));
    }
  }, []);

  const initChat = (user) => {
    setChatStarted(true);
    setChatUser(`${user.firstName} ${user.lastName}`);
    setuserToMessageUid(user.uid);

    console.log(user);

    dispatch(getMessages({ user_from: auth.uid, user_to: user.uid}))
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
    <Layout>
      <section className="container">
        <div className="listOfUsers">
          {
            user.users.length > 0 ?
            user.users.map(user => {
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
                <div style={{ textAlign: msg.user_from == auth.uid ? 'right' : 'left' }}>
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
      </section>
    </Layout>
  );
}

export default HomePage;