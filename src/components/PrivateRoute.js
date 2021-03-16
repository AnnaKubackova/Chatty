import React from 'react';
import { 
  Redirect, 
  Route 
} from 'react-router-dom';

/**
* @author
* @function PrivateRoute
**/

const PrivateRoute = ({component: Component, ...rest}) => {
  return(
    <Route {...rest} component={(props) => {
      const user = sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user')) : null;

      if (user) {
        return <Component {...props} />
      } else {
        return <Redirect to={`/login`} />
      }
    }} />
  )
}

export default PrivateRoute