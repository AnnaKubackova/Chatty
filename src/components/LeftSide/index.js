import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, Link } from "react-router-dom";
import './style.css';
import { logout } from '../../actions'
import Logo from '../Logo';

/**
* @author
* @function LeftSide
**/

const LeftSide = (props) => {
  const auth = useSelector(state => state.auth);
  const dispatch = useDispatch();

  return(     
    <section className="leftSection">
      <Logo />
      {props.children}
    </section>
   )

 }

export default LeftSide