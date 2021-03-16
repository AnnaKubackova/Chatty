import React from 'react'
import { 
    useSelector 
} from 'react-redux';
import './style.css';
import logo from '../../logo.svg';

/**
* @author
* @function Header
**/

const Header = (props) => {
    const auth = useSelector(state => state.auth);

    return(
        <header className="header">
            {
                !auth.authenticated ?
                    <div>
                        <img src={logo} alt="chatty logo" />
                    </div>
                : 
                    <div className="loggedInLogo">
                        <img src={logo} alt="chatty logo" />
                    </div>
            }       
        </header>
    )
 }

export default Header