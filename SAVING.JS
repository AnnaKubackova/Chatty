<ul className="leftMenu">
          <li><NavLink to={'/login'}>Login</NavLink></li>
          <li><NavLink to={'/signup'}>Sign up</NavLink></li>
        </ul>

      

        <div style={{margin: '20px 0', color: '#fff', fontWeight: 'bold'}}>
          {
          auth.authenticated ? 
              `Hi ${auth.firstName} ${auth.lastName}`
          :
              null
          }                
        </div>

        <ul className="menu">
            {
                auth.authenticated ?
                    <li>
                        <Link to={'#'} onClick={() => {
                            dispatch(logout(auth.uid))
                        }}>Logout</Link>
                    </li>
                : 
                    null
            }                  
        </ul>