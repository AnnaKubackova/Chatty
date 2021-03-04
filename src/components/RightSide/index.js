import React from 'react'
import './style.css';

/**
* @author
* @function RightSide
**/

const RightSide = (props) => {
  return(
    <section className="rightSection">
        {props.children}
    </section>
   )

 }

export default RightSide