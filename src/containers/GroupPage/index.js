import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import LeftSide from '../../components/LeftSide';
import RightSide from '../../components/RightSide'
import './style.css';
import { getOnlineUsers, createGroup, getGroupList } from '../../actions';
import icon from '../../addgroupIcon.svg';

const User = (props) => {
    const {user, addToGroup} = props;
  
    return (
        <div className="user" onClick={() => addToGroup(user)}>
          <div className="userImage" style={{backgroundImage: `url(${user.image})`}}></div>
          <p>{user.firstName} <br /> {user.lastName}</p>
        </div>
    )
}

const GroupPage = (props) => {
    const dispatch = useDispatch();
    const auth = useSelector(state => state.auth);
    const user = useSelector(state => state.user);
    const group = useSelector(state => state.group);
    const [modalclicked, setModalclicked] = useState(false);
    const [groupMembers, setGroupMembers] = useState([]);
    let unsubscribe;
    let groups;

    useEffect(() => {
        groups = dispatch(getGroupList(auth.uid))
        .then(groups => {
          return groups;
        })
        .catch(error => {
          console.log(error)
        })
    }, []);

    useEffect(() => {
        unsubscribe = dispatch(getOnlineUsers(auth.uid))
        .then(unsubscribe => {
          return unsubscribe;
        })
        .catch(error => {
          console.log(error)
        })
    }, []);

    const openmodal = () => {
        setModalclicked(true)
    }

    const addMemberToGroup = (userInfo) => {
        console.log("person clicked", userInfo.uid);
        groupMembers.push(userInfo.uid);
        console.log(groupMembers);
    }

    const createGroupMembers = () => {
        groupMembers.push(auth.uid);
        console.log(groupMembers);
        dispatch(createGroup(groupMembers))
    }

    return (
        <div>
            <div id="myModal" className={ modalclicked === true ? "modal show" : "modal hide"}>
                <div className="modal-content">
                    <h3>Create new group</h3>
                    <span onClick={ () => { setModalclicked(false) } } className="close">&times;</span>
                    <div>
                        <button onClick={createGroupMembers}>Create group</button>
                    </div>
                    <div className="usersContainer">
                        {              
                            user.users.length > 0 ? 
                                user.users.map(user => {
                                    return(
                                        <User 
                                            addToGroup={addMemberToGroup}
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