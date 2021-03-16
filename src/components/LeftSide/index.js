import React from 'react';
import { 
  useSelector 
} from 'react-redux';
import './style.css';
import Logo from '../Logo';
import Navigation from '../Navigation';

/**
* @author
* @function LeftSide
**/

const LeftSide = (props) => {
  const auth = useSelector(state => state.auth);

  return(     
    <section className="leftSection">
      <Logo />
      {
        auth.authenticated ?
          <Navigation />
        : 
          null
      }

      {props.children}
    </section>
   )

 }

export default LeftSide