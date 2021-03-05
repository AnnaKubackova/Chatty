import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './style.css';

/**
* @author
* @function Info
**/

const Info = (props) => { 
    const auth = useSelector(state => state.auth);
    console.log("THIS IS THE AUTH: ", auth);
    return(
    <div className="info">
        <p>{`${auth.firstName} ${auth.lastName}`}</p>
        <img src={`${auth.image}`}/>
    </div>
    )
}

export default Info