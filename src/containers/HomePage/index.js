import React, { useEffect, useState } from 'react';
import LeftSide from '../../components/LeftSide';
import RightSide from '../../components/RightSide'
import './style.css';
import { useDispatch, useSelector } from 'react-redux'
import { getMessages, getOnlineUsers, updateMessage, logout, updateInfo } from '../../actions';
import { Link } from "react-router-dom";
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
        <img src="https://firebasestorage.googleapis.com/v0/b/web-messenger-23489.appspot.com/o/images%2Fprofile_placeholder.jpg?alt=media&token=bb2e4561-0fe7-4d97-a7aa-d25c5a52b499" alt="" />
        <p>{user.firstName} {user.lastName}</p>
    </div>
  )
}

const HomePage = (props) => {
  const dispatch = useDispatch();
  const auth = useSelector(state => state.auth);
  const user = useSelector(state => state.user);
  var [firstName, setFirstName] = useState('');
  var [lastName, setLastName] = useState('');
  const [chatStarted, setChatStarted] = useState(false);
  const [chatUser, setChatUser] = useState('');
  const [message, setMessage] = useState('');
  const [userToMessageUid, setuserToMessageUid] = useState(null);
  const [uploadedImage, setuploadedImage] = useState('');
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

  const hiddenFileInput = React.useRef(null);
  
  const handleClick = event => {
    hiddenFileInput.current.click();
  };


  const handleChange = event => {
    const fileUploaded = event.target.files[0];
    var fileUploadedName = '';
    if(fileUploaded.name.length > 12) {
      fileUploadedName = "..." + fileUploaded.name.substr(-12);
    } else {
      fileUploadedName = fileUploaded.name;
    }    
    setuploadedImage(fileUploadedName);
  };

  const submitUpdate = (event) => {
    event.preventDefault();
    
    dispatch(updateInfo({ firstName, lastName }));
  }

  return (
    <div>
      <LeftSide>
        <section className="container allUsers">
            <div className="onlineUsers">
              <h3>Online</h3>
              <div className="usersContainer">
                {              
                  user.users.length > 0 ? 
                    user.users.map(user => {
                      return(
                        user.isOnline ?  
                          <User 
                            getUserToChat={initChat}
                            key={user.uid} 
                            user={user} 
                          />
                        : null
                      ) 
                    })
                  : null
                }
              </div>
              
            </div>
            
            <div className="offlineUsers">
              <h3>Offline</h3>
              <div className="usersContainer">
                {              
                  user.users.length > 0 ? 
                    user.users.map(user => {
                      return(
                        !user.isOnline ?  
                          <User 
                            getUserToChat={initChat}
                            key={user.uid} 
                            user={user} 
                          />
                        : null
                      ) 
                    })
                  : null
                }
              </div>
            </div>            
        </section>
      </LeftSide>

      <RightSide>
        {
          auth.authenticated ?
            <div className="updateForm">
              <form onSubmit={submitUpdate}>
                <h3>Update your profile</h3>
                <div>
                  <label for="firstName">First Name: </label>
                  <input
                    name="firstName"
                    type="text"
                    placeholder={auth.firstName}
                    value={firstName}
                    onChange={(e) => e.target.value="" ? setFirstName(e.target.placeholder) : setFirstName(e.target.value)}
                    />{}
                </div>

                <div>
                  <label for="lastName">Last Name:</label>
                  <input
                    name="lastName"
                    type="text"
                    placeholder={auth.lastName}
                    value={lastName}
                    onChange={(e) => e.target.value="" ? setLastName(e.target.placeholder) : setLastName(e.target.value)}
                  />
                </div>

                <div className="imageUploadContainer">
                  <label for="image"> Profile Picture:</label>
                  <Button onClick={handleClick}>
                    Upload a file
                  </Button>
                  <span>{uploadedImage}</span>
                  <input type="file"
                    name="image"
                    ref={hiddenFileInput}
                    onChange={handleChange}
                    style={{display:'none'}} 
                  />
                </div>

                <div className="updateButton">
                  <button 
                    disabled={ firstName || lastName ? false : true } 
                    onClick={submitUpdate}
                  >Update</button>
                </div>
                
              </form>

              <div className="bottomProfileMenu">
                <a className="deleteProfile">Delete profile</a>

                <Link to={'#'} onClick={() => {
                  dispatch(logout(auth.uid))
                }}>Log out <img src={icon} /></Link>              
              </div>
                  
            </div>
          : 
              null
        }  
      </RightSide>
    </div>
    
  );
}

export default HomePage;