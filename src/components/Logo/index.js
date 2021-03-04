import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import './style.css';
import { logout } from '../../actions'
import logo from '../../logo.svg';

/**
* @author
* @function Header
**/

const Header = (props) => {
    const auth = useSelector(state => state.auth);
    const dispatch = useDispatch();

    return(
        <header className="header">
            {
                !auth.authenticated ?
                <div>
                    <img src={logo} className="App-logo" alt="logo" />
                </div>
                : 
                <div className="loggedInLogo">
                    <img src={logo} className="App-logo" alt="logo" />
                </div>
            }       
        </header>
    )
 }

export default Header