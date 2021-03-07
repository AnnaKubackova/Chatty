import React from 'react'
import { NavLink } from "react-router-dom";
import './style.css';

/**
* @author
* @function Navigation
**/

const Navigation = (props) => {
    return(
        <nav>
            <ul>
                <li><NavLink exact to={'/'}>All users</NavLink></li>
                <li><NavLink to={'/chats'}>Your chats</NavLink></li>
                <li><NavLink to={'/groups'}>Your groups</NavLink></li>
            </ul> 
        </nav>
    )

 }

export default Navigation