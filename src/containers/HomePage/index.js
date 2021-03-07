import React, { useEffect, useState } from 'react';
import LeftSide from '../../components/LeftSide';
import RightSide from '../../components/RightSide'
import './style.css';
import { useDispatch, useSelector } from 'react-redux'
import { getMessages, getOnlineUsers, updateMessage, logout, updateInfo, deleteUser, getMessageCollection } from '../../actions';
import { Link, Redirect } from "react-router-dom";
import styled from "styled-components";
import icon from '../../icon.svg';

const Button = 
  styled.a`
    background-color: var(--dark-blue);
    color: white;
    border-radius: 10px;
    padding: 5px 15px;
    font-size: 18px;
    cursor: pointer;
    transition: ease .2s;
    opacity: .8;`
  ;

const User = (props) => {
  const {user, getUserToChat} = props;

  return (
    <div onClick={() => getUserToChat(user)} className="user">
        <img src={user.image} alt="" />
        <p>{user.firstName} {user.lastName}</p>
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

      dispatch(getMessages({
        user_from: auth.uid,
        user_to: user.uid
      }))
    }

    const sendMessage = (e) => {
      const messageObj = {
        user_from: auth.uid,
        user_to: userToMessageUid,
        message
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
      <LeftSide>
        <section className="container allUsers">
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
      </RightSide>
    </div>
    
  );
}

export default HomePage;