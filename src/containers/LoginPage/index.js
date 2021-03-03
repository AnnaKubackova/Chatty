import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { isUserLoggedIn, sigin } from '../../actions';
import Layout from '../../components/Layout';
import Card from '../../components/UI/Card';
import './style.css';

/**
* @author
* @function LoginPage
**/

const LoginPage = (props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const auth = useSelector(state => state.auth);

  const userLogin = (e) => {
    e.preventDefault();

    if(email == ""){
      alert('Email is required');
      return;
    }
    if(password == ""){
      alert('Email is required');
      return;
    }

    dispatch(sigin({ email, password }));
  }

  if(auth.authenticated) {
    return <Redirect to={'/'} />
  }

  return(
    <Layout>
      <div className="loginContainer">
        <Card>
          <form onSubmit={userLogin}>
            <input 
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
            />

            <input 
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />

            <div>
              <button>
                Log in
              </button>
            </div>
          </form>
        </Card>
      </div>
    </Layout>
   )

 }

export default LoginPage