import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, Link } from "react-router-dom";
import './style.css';
import { logout } from '../../actions'

/**
* @author
* @function Navigation
**/

const Navigation = (props) => {
    const auth = useSelector(state => state.auth);
    const dispatch = useDispatch();

    return(
        <nav>
            <ul>
                <li><NavLink to={'/profile'}>All users</NavLink></li>
                <li><NavLink to={'/chats'}>Your chats</NavLink></li>
                <li><NavLink to={'/groups'}>Your groups</NavLink></li>
            </ul> 
        </nav>
    )

 }

export default Navigation