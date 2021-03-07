import React from 'react';
import { useSelector } from 'react-redux';
import './style.css';
import Logo from '../Logo';

/**
* @author
* @function LeftSide
**/

const LeftSide = (props) => {
  const auth = useSelector(state => state.auth);

  return(     
    <section className="leftSection">
      <Logo />

      {props.children}
    </section>
   )

 }

export default LeftSide