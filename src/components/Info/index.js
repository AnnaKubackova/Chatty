import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
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
        <img src="https://i.pinimg.com/originals/be/ac/96/beac96b8e13d2198fd4bb1d5ef56cdcf.jpg" alt="" />
    </div>
    )
}

export default Info