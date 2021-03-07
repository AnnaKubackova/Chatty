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
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [uploadedImage, setuploadedImage] = useState('');
  const [uploadedImageName, setuploadedImageName] = useState('');
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
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    return () => {
      unsubscribe.then(f => f()).catch(error => console.log(error));
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const initChat = (userT) => {
      let test = [];
      test.push(userT.uid);
      if(userT){
        user.chats.push(test);
      }
      localStorage.setItem('chatUsers', JSON.stringify(test[0]));
    console.log("redirected info: ", user.chats);
      getMessageCollection(userT.uid);
    //setChatStarted(true);
    //setChatUser(`${user.firstName} ${user.lastName}`);
    //setuserToMessageUid(user.uid);

    console.log(user.chats);

    //dispatch(getMessages({ user_from: auth.uid, user_to: user.uid}));

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

    setuploadedImageName(fileUploadedName);
    setuploadedImage(fileUploaded);
  };

  const submitUpdate = (event) => {
    event.preventDefault();

    dispatch(updateInfo({ firstName, lastName, uploadedImage }));
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
                  <label htmlFor="firstName">First Name: </label>
                  <input
                    name="firstName"
                    type="text"
                    placeholder={auth.firstName}
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />{}
                </div>

                <div>
                  <label htmlFor="lastName">Last Name:</label>
                  <input
                    name="lastName"
                    type="text"
                    placeholder={auth.lastName}
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>

                <div className="imageUploadContainer">
                  <label htmlFor="image"> Profile Picture:</label>
                  <Button onClick={handleClick}>
                    Upload a file
                  </Button>
                  <span>{uploadedImageName}</span>
                  <input type="file"
                    name="image"
                    ref={hiddenFileInput}
                    onChange={handleChange}
                    style={{display:'none'}} 
                  />
                </div>

                <div className="updateButton">
                  <button 
                    disabled={ firstName || lastName || uploadedImage ? false : true }
                  >Update</button>
                </div>
                
              </form>

              <div className="bottomProfileMenu">
                <Link to={'#'}
                  className="deleteProfile"
                  onClick={() => {
                    dispatch(deleteUser(auth.uid))
                  }}
                >
                  Delete profile
                </Link>

                <Link to={'#'} onClick={() => {
                  dispatch(logout(auth.uid))
                }}>
                  Log out <img src={icon} />
                </Link>              
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