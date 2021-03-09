import React from 'react'
import { 
  useSelector 
} from 'react-redux';
import './style.css';
import Info from '../Info';

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
            <Info />
          : 
            null
        }
        {props.children}
    </section>
   )

 }

export default RightSide