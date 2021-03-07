import React from 'react';
import { useSelector } from 'react-redux';
import './style.css';

/**
* @author
* @function Info
**/

const Info = (props) => { 
    const auth = useSelector(state => state.auth);
    return(
    <div className="info">
        <p>{`${auth.firstName} ${auth.lastName}`}</p>
        <img src={`${auth.image}`} alt={`${auth.firstName} ${auth.lastName}`} />
    </div>
    )
}

export default Info