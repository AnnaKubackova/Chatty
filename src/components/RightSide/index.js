import React from 'react'
import { useSelector } from 'react-redux';
import editProfile from '../editProfile';
import './style.css';

/**
* @author
* @function RightSide
**/

const RightSide = (props) => {
  const auth = useSelector(state => state.auth);

  return(
    <section className={ auth.authenticated ? "rightSectionLoggedIn" : "rightSection"}>
                {
          auth.authenticated ?
            <editProfile />
          : 
            null
        }
        {props.children}
    </section>
   )

 }

export default RightSide