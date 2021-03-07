import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import LeftSide from '../../components/LeftSide';
import RightSide from '../../components/RightSide'
import './style.css';
import { getOnlineUsers, logout, updateInfo, deleteUser, setNewPersonToChat } from '../../actions';
import icon from '../../addgroupIcon.svg';

const User = (props) => {
    const { user } = props;
  
    return (
        <div className="user">
          <div className="userImage" style={{backgroundImage: `url(${user.image})`}}></div>
          <p>{user.firstName} <br /> {user.lastName}</p>
        </div>
    )
}

const GroupPage = (props) => {
    const dispatch = useDispatch();
    const auth = useSelector(state => state.auth);
    const user = useSelector(state => state.user);
    const [modalclicked, setModalclicked] = useState(false);
    let unsubscribe;

    const openmodal = () => {
        setModalclicked(true)
    }

    useEffect(() => {
        unsubscribe = dispatch(getOnlineUsers(auth.uid))
        .then(unsubscribe => {
          return unsubscribe;
        })
        .catch(error => {
          console.log(error)
        })
    }, []);

    return (
        <div>
            <div id="myModal" className={ modalclicked === true ? "modal show" : "modal hide"}>
                <div className="modal-content">
                    <h3>Create new group</h3>
                    <span onClick={ () => { setModalclicked(false) } } className="close">&times;</span>
                    <div>
                        <button onClick={ () => { console.log("create group") } }>Create group</button>
                    </div>
                    <div className="usersContainer">
                        {              
                            user.users.length > 0 ? 
                                user.users.map(user => {
                                    return(
                                        <User 
                                            key={user.uid} 
                                            user={user} 
                                        />
                                    ) 
                                })
                            : null
                        }
                    </div>                    
                </div>
            </div>

            <LeftSide>
                <section className="allUsers">
                    <div className="createGroupPopup">
                        <button
                            onClick={openmodal}
                        >
                            <img src={icon} /> Create new group
                        </button>                        
                    </div>
                </section>
            </LeftSide>

            <RightSide>
                <h3>Groups</h3>
            </RightSide>
        </div>
        
    )
}

export default GroupPage;