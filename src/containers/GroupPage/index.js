import React, { 
    useEffect, 
    useState, 
    useRef 
} from 'react';
import { 
    useDispatch, 
    useSelector 
} from 'react-redux';
import { 
    getOnlineUsers, 
    createGroup, 
    getGroupList, 
    getGroupMessages, 
    updateGroupMessage
} from '../../actions';
import icon from '../../addgroupIcon.svg';
import creategrpicon from '../../creategroupIcon.svg';
import './style.css';
import LeftSide from '../../components/LeftSide';
import RightSide from '../../components/RightSide'

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
        <div onClick={() => getGroupToChat(group)} className="user">
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
    const messageRef = useRef(); 

    useEffect(() => {
        if(messageRef.current){
          messageRef.current.scrollIntoView(
            {
              block: 'end',
              inline: 'nearest'
            })
        }
    }, [messageRef.current]);

    useEffect(() => {
        dispatch(getGroupList(auth.uid))
        .then(groups => {
          return groups;
        })
        .catch(error => {
          console.log(error)
        })
    }, []);

    useEffect(() => {
        dispatch(getOnlineUsers(auth.uid))
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
                            <button><img src={creategrpicon} alt="create icon"/>Create</button>                            
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
                            : 
                                null
                        }
                    </div>                    
                </div>
            </div>

            <LeftSide>
                <section className="allUsers">
                    <div className="createGroupPopup">
                        <button onClick={openmodal} >
                            <img src={icon} alt="create group icon" /> Create new group
                        </button>                        
                    </div>
                    
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
                </section>
            </LeftSide>

            <RightSide>
                <div className="chatArea">
                    {
                        groupSelectedId!=='' ? 
                            <div className="groupchatHeader"> 
                                <p>{groupSelectedName}</p>  
                                <div className="chatGroupMembers">
                                    {
                                        group.members.groupMembers ?
                                            group.members.groupMembers.map(name => 
                                                <div>
                                                    <div className="userImage" style={{backgroundImage: `url(${name.image})`}}></div> 
                                                    <span>{name.firstName}</span>
                                                </div>                                           
                                            )
                                        : 
                                            group.members.map(name =>
                                                <div>
                                                    <div className="userImage" style={{backgroundImage: `url(${name.image})`}}></div> 
                                                    <span>{name.firstName}</span>
                                                </div>     
                                            )
                                    }                                
                                </div>
                            </div>            
                        : 
                            null
                    }

                    <div className="messageSections">
                        {
                            groupSelectedId ? 
                                group.messages.length === 0 ?
                                    null
                                :
                                    group.messages.map((msg) => 
                                        <div key={msg.groupMessageId} className={ msg.user_from === auth.uid ? 'rightMessage' : 'leftMessage' }  ref={messageRef}>
                                            {   
                                                group.members.groupMembers ?
                                                    null
                                                : 
                                                    group.members.map(name =>
                                                        name.uid === msg.user_from ?
                                                            <p className="messageCreatedAt">{name.firstName}</p>
                                                        :
                                                            null
                                                    ) 
                                            }
                                            <p className="messageStyle" >{msg.groupMessage}</p>
                                            <p className="messageCreatedAt">{new Date(msg.createdAt.seconds * 1000 + msg.createdAt.nanoseconds / 1000000).toLocaleDateString('en-GB', {hour: '2-digit', minute: '2-digit'})}</p>
                                        </div> 
                                    )            
                            : 
                                null
                        }
                    </div>

                    <div className="chatControls">
                        <textarea 
                            value={groupMessage}
                            onChange={(e) => setgroupMessage(e.target.value)}
                            onKeyPress={(e) => {
                                if(e.key === 'Enter' && groupMessage !== ""){
                                    sendGroupMessage();
                                    e.preventDefault();
                                }
                            }}
                            disabled={ groupSelectedId==='' ? true : false } 
                            placeholder="Write here"
                        />
                        <button 
                            disabled={ groupSelectedId==='' || groupMessage === "" ? true : false } 
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