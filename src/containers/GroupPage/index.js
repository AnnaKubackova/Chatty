import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import LeftSide from '../../components/LeftSide';
import RightSide from '../../components/RightSide'
import './style.css';
import { getOnlineUsers, createGroup, getGroupList, getGroupMessages, updateGroupMessage, getGroupMembers } from '../../actions';
import icon from '../../addgroupIcon.svg';
import creategrpicon from '../../creategroupIcon.svg';

const User = (props) => {
    const {user, addToGroup} = props;
  
    return (
        <div className="user" onClick={() => addToGroup(user)}>
          <div className="userImage" style={{backgroundImage: `url(${user.image})`}}></div>
          <p>{user.firstName} <br /> {user.lastName}</p>
        </div>
    )
}

const Group = (props) => {
    const {group, getGroupToChat} = props;

    return (
        <div onClick={() => getGroupToChat(group)}>
            <p>{group.groupname}</p>
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
    const [groupMembersNames, setGroupMembersNames] = useState([]);
    const [groupname, setGroupname] = useState('');
    const [groupSelectedId, setgroupSelectedId] = useState('');
    const [groupSelectedName, setgroupSelectedName] = useState('');
    const [groupMessage, setgroupMessage] = useState('');

    const [testvalue, settestvalue] = useState(0);
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

    const closemodal = () => {
        setModalclicked(false);
        setGroupMembersNames([]);
        setGroupMembers([]);
        groupMembers.length = 0;
    }

    const addMemberToGroup = (userInfo) => {
        groupMembers.push(userInfo.uid);
        
        groupMembersNames.push(userInfo.firstName + ", ");
        let groupMembersUiName = [];
        groupMembersUiName.push(groupMembersNames);
        setGroupMembersNames(groupMembersUiName);
    }

    const createGroupMembers = (e) => {
        e.preventDefault(); 
        groupMembers.push(auth.uid);

        const info = {
            groupMembers, groupname
        }
       
        console.log(info);
        dispatch(createGroup(info));
        setModalclicked(false);
        setGroupname('');
        groupMembers.length = 0;
        setGroupMembersNames([]);
        setGroupMembers([]);
    }

    const initGroupChat = (group) => {
        setgroupSelectedId(group.groupId);
        setgroupSelectedName(group.groupname);        
        dispatch(getGroupMessages(group));     
        dispatch(getGroupMembers(group.groupId));
    }

    const sendGroupMessage = () => {
        var groupMessageObj = {
            user_from: auth.uid,
            group_to: groupSelectedId,
            groupMessage
        }

        if (groupMessage !== "") {
            dispatch(updateGroupMessage(groupMessageObj))
            .then(() => {
                setgroupMessage('');
            })
        }     
        
        dispatch(getGroupMembers(groupMessageObj.group_to));   
    }

    return (
        <div>
            <div id="myModal" className={ modalclicked === true ? "modal show" : "modal hide"}>
                <div className="modal-content">
                    <div className="createGroup">
                        <h3>Create new group</h3>
                        <span onClick={closemodal} className="close">&times;</span>

                        <div className="groupMembers"><p>Members:&nbsp;</p><p className="memberlist">{groupMembersNames}</p></div>

                        <form onSubmit={createGroupMembers}>
                            <input 
                                required
                                name="groupname"
                                type="text"
                                value={groupname}
                                placeholder='Group name...'
                                onChange={(e) => setGroupname(e.target.value)}
                            />
                            <button><img src={creategrpicon}/>Create</button>
                            
                        </form>
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
                    <div className="listOfUsers">
                    {
                        group.groups.length > 0 ?
                        group.groups.map(group => {
                            return(                                 
                                <Group 
                                    getGroupToChat={initGroupChat}
                                    key={group.groupId} 
                                    group={group} 
                                />
                            );
                        })
                        :
                        null
                    }
                    </div>
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
                <div className="chatArea">
                    {
                        groupSelectedId!=='' ? 
                        <div className="chatHeader"> 
                            <p>{groupSelectedName}</p>  
                            {
                                group.members.groupMembers ?
                                    group.members.groupMembers.map(name => 
                                        <span>{name.firstName}</span>
                                    )
                                : 
                                    group.members.map(name =>
                                        <span>{name.firstName}</span>
                                    )
                            }
                        </div>            
                        : null
                    }

                    <div className="messageSections">
                        {
                        groupSelectedId ? 
                        group.messages.map(msg => 
                            <div key={msg.createdAt}  className={ msg.user_from === auth.uid ? 'rightMessage' : 'leftMessage' }>
                                <p className="messageStyle" >{msg.groupMessage}</p>
                                <p className="messageCreatedAt">{new Date(msg.createdAt.seconds * 1000 + msg.createdAt.nanoseconds / 1000000).toLocaleDateString('en-GB', {hour: '2-digit', minute: '2-digit'})}</p>
                                
                                {   
                                    group.members.groupMembers ?
                                        null
                                    : 
                                        group.members.map(name =>
                                            name.uid === msg.user_from ?
                                                <p>{name.firstName}</p>
                                            :null
                                        ) 
                                }
                            </div> 
                        )            
                        : null
                        }
                    </div>

                    <div className="chatControls">
                        <textarea 
                            value={groupMessage}
                            onChange={(e) => setgroupMessage(e.target.value)}
                            onKeyPress={(e) => {
                                if(e.key === 'Enter'){
                                sendGroupMessage()
                                }
                            }}
                            disabled={ groupSelectedId==='' ? true : false } 
                            placeholder="Write here"
                        />
                        <button 
                            disabled={ groupSelectedId==='' ? true : false } 
                            onClick={sendGroupMessage}
                        >
                            Send
                        </button>
                    </div>
                </div>
            </RightSide>
        </div>
        
    )
}

export default GroupPage;