import React, { 
  useEffect 
} from 'react';
import { 
  BrowserRouter as Router, 
  Route 
} from "react-router-dom";
import { 
  useDispatch, 
  useSelector 
} from 'react-redux';
import { 
  isUserLoggedIn 
} from './actions';
import './App.css';
import HomePage from './containers/HomePage';
import LoginPage from './containers/LoginPage';
import RegisterPage from './containers/RegisterPage';
import ChatPage from './containers/ChatPage';
import GroupPage from './containers/GroupPage';
import PrivateRoute from './components/PrivateRoute';

function App() {
  const auth = useSelector(state => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if(!auth.authenticated) {
      dispatch(isUserLoggedIn());
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="App">
      <Router>
        <PrivateRoute path="/" exact component={HomePage} />
        <Route path="/login" component={LoginPage} />
        <Route path="/signup" component={RegisterPage} />
        <PrivateRoute path="/chats" exact component={ChatPage} />
        <PrivateRoute path="/groups" exact component={GroupPage} />
      </Router>
    </div>
  );
}

export default App;
