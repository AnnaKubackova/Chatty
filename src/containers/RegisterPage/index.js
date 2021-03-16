import React, { 
  useState 
} from 'react';
import { 
  useDispatch, 
  useSelector 
} from 'react-redux';
import { 
  Redirect, 
  NavLink 
} from 'react-router-dom';
import { 
  signup 
} from '../../actions';
import LeftSide from '../../components/LeftSide';
import RightSide from '../../components/RightSide';
import Card from '../../components/UI/Card';

/**
* @author
* @function RegisterPage
**/

const RegisterPage = (props) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [image] = useState('https://firebasestorage.googleapis.com/v0/b/web-messenger-23489.appspot.com/o/profile_placeholder.jpg?alt=media&token=f51f9f08-574b-4b1d-ba02-4e566877ca59');
  const dispatch = useDispatch();
  const auth = useSelector(state => state.auth);

  const registerUser = (e) => {
    e.preventDefault();

    const user = {
      firstName, lastName, email, password, image
    };

    dispatch(signup(user));
  }

  if(auth.authenticated) {
    return <Redirect to={'/'} />
  }

  return(
    <div>
      <LeftSide />

      <RightSide>        
          <h2>Register</h2>
          <Card>
            <form onSubmit={registerUser}>
              <label htmlFor="firstName">First Name:</label>
              <input 
                name="firstName"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />

              <label htmlFor="laststName">Last Name:</label>
              <input 
                name="lastName"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />

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