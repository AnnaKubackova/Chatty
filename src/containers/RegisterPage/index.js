import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { NavLink } from "react-router-dom";
import LeftSide from '../../components/LeftSide';
import RightSide from '../../components/RightSide';
import Card from '../../components/UI/Card';
import { signup } from '../../actions';

/**
* @author
* @function RegisterPage
**/

const RegisterPage = (props) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const auth = useSelector(state => state.auth);

  const registerUser = (e) => {
    e.preventDefault();

    const user = {
      firstName, lastName, email, password
    };

    dispatch(signup(user));
  }

  if(auth.authenticated) {
    return <Redirect to={'/profile'} />
  }

  return(
    <div>
      <LeftSide />
      <RightSide>        
          <h2>Register</h2>
          <Card>
            <form onSubmit={registerUser}>
              <label for="firstName">First Name:</label>
              <input 
                name="firstName"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />

              <label for="laststName">Last Name:</label>
              <input 
                name="lastName"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />

              <label for="email">Email:</label>
              <input 
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <label for="password">Password:</label>
              <input 
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <button>Sign up</button>
            </form>
          </Card>

          <p className="linkToRegisterLogin">
            Already have an account? <NavLink to={'/login'}>Log in</NavLink>
          </p>
      </RightSide>
    </div>
   )

 }

export default RegisterPage