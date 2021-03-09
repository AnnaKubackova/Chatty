import React, { 
  useEffect, 
  useState 
} from 'react';
import { 
  useDispatch, 
  useSelector 
} from 'react-redux'
import { 
  Link 
} from "react-router-dom";
import { 
  getOnlineUsers, 
  logout, 
  updateInfo, 
  deleteUser, 
  setNewPersonToChat, 
  searchUserName 
} from '../../actions';
import styled from "styled-components";
import './style.css';
import icon from '../../logoutIcon.svg';
import LeftSide from '../../components/LeftSide';
import RightSide from '../../components/RightSide'

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
      <Link to={'/chats'}>
        <div className="userImage" style={{backgroundImage: `url(${user.image})`}}></div>
        <p>{user.firstName} {user.lastName}</p>
      </Link>
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
  const [searchName, setsearchName] = useState('');
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
    let newperson = userT;
    dispatch(setNewPersonToChat(newperson));
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

  const searchUser = (e) => {
    e.preventDefault();
    dispatch(searchUserName(searchName));
  }

  return (
    <div>
      <LeftSide>
        <section className="allUsers">
            <form onSubmit={searchUser} className="searchFrom">
              <input 
                type="text"
                placeholder="Search for users"
                value={searchName}
                onChange={(e) => setsearchName(e.target.value)}
              />

              <button>Search</button>
            </form>

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
                        : 
                          null
                      ) 
                    })
                  : 
                    null
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
                        : 
                          null
                      ) 
                    })
                  : 
                    null
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
                  Log out <img src={icon} alt="log out icon" />
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