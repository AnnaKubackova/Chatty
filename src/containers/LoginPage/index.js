import React, { 
  useState 
} from 'react';
import { 
  useDispatch, 
  useSelector 
} from 'react-redux';
import { 
  Redirect 
} from 'react-router-dom';
import { 
  NavLink 
} from "react-router-dom";
import { 
  sigin, 
  signInWithGoogle 
} from '../../actions';
import './style.css';
import LeftSide from '../../components/LeftSide';
import RightSide from '../../components/RightSide';
import Card from '../../components/UI/Card';

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

    if(email === ""){
      alert('Email is required');
      return;
    }
    if(password === ""){
      alert('Email is required');
      return;
    }

    dispatch(sigin({ email, password }));
  }

  if(auth.authenticated) {
    return <Redirect to={'/'} />
  }

  return(
    <div>
      <LeftSide />

      <RightSide>
        <h2>Log in</h2>
        <Card>
          <button className="googleSignUp" onClick={
            (e) => {dispatch(signInWithGoogle(e))}
          }>
            <img src="https://developers.google.com/identity/images/g-logo.png" alt="google icon"/>
            <span> Sign in with Google</span>
          </button>
          <form onSubmit={userLogin}>
            <label htmlFor="email">Email:</label>
            <input 
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <label htmlFor="password">Password:</label>
            <input 
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            
            <button>Log in</button>
          </form>
        </Card>

        <p className="linkToRegisterLogin">
          No account yet? <NavLink to={'/signup'}>Register</NavLink>
        </p>
      </RightSide>
    </div>
  )
}

export default LoginPage