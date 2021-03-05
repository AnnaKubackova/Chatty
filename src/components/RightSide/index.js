import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import Info from '../Info';
import './style.css';

/**
* @author
* @function RightSide
**/

const RightSide = (props) => {
  const auth = useSelector(state => state.auth);
  const dispatch = useDispatch();

  return(
    <section className={ auth.authenticated ? "rightSectionLoggedIn" : "rightSection"}>
        {
          auth.authenticated ?
            <Info />
          : 
            null
        }
        {props.children}
    </section>
   )

 }

export default RightSide