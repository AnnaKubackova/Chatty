import React, {useEffect, useState} from 'react';
import { 
    NavLink 
} from "react-router-dom";
import './style.css';
import {fetchUnseenMessages} from '../../actions';
import {
    useDispatch,
    useSelector
} from 'react-redux';

/**
* @author
* @function Navigation
**/

const Navigation = (props) => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);

    useEffect(() => {
        console.log("we are in the navgation!");
        
        dispatch(fetchUnseenMessages());
    },[user.messages])

    return(
        <nav>
            <ul>
                <li><NavLink exact to={'/'}>All users</NavLink></li>
                <li><NavLink to={'/chats'}>Your chats {user.unSeenMessages > 0 ?<span className="unseenMessages">{user.unSeenMessages}</span> : null}</NavLink></li>
                <li><NavLink to={'/groups'}>Your groups</NavLink></li>
            </ul>
        </nav>
    )

 }

export default Navigation