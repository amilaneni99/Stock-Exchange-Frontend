import './App.css';
import Login from '../Components/Login/Login';
import Signup from '../Components/Signup/Signup';
import useToken from './UserAuthService';
import Sidebar from '../Sidebar/Sidebar';
import Navbar from './Navbar/Navbar';
import { Route, BrowserRouter as Router, Switch, BrowserRouter, Redirect } from 'react-router-dom';
import { Dashboard } from '@material-ui/icons';
import Import from '../Components/Import/Import';
import Companies from '../Components/Companies/Companies';
import StockExchanges from '../StockExchanges/StockExchanges';
import CompanyData from '../Components/Companies/CompanyData';
import Compare from '../Components/Compare/Compare';
import PrivateRoute from './PrivateRoute';
import { useEffect, useState } from 'react';
import NotConfirmedUser from '../Components/Login/NotConfirmedUser';
import UserAuthService from './UserAuthService';


function App() {

  const {setUser, user, setToken, token} = UserAuthService();

  return (
    <div className="App">
      <Router>
        {
          !user && !token &&
            <>
              <Route exact path='/login' component={() => (<Login setUser={setUser} setToken={setToken}/>)} />
              <Route exact path='/signup' component={() => (<Signup setUser={setUser} setToken={setToken}/>)} />
              {/* <Route exact path='/not-confirmed' component={NotConfirmedUser} /> */}
              <Route render={({location}) => (!(['/login','/signup','/not-confirmed'].includes(location.pathname))) ? 
                <Redirect to='/login' />
                :
                null
              } />
            </>
        }
        {
          user && token &&
          <>
            <Sidebar admin={true}/>
            <div className="right">
              <Navbar initials={(user.name) ? user.name.substring(0,2).toUpperCase() : null}/>
              <div className="content">
                <Switch>
                  <Route exact path='/' component={() => (<Dashboard token={token}/>)} />
                  <Route exact path="/stockExchanges" component={() => (<StockExchanges setToken={setToken} token={token}/>)} />
                  <Route exact path='/import' component={() => (<Import token={token}/>)} />
                  <Route exact path='/companies/:id' component={() => (<CompanyData token={token} />)} />
                  <Route exact path='/companies' component={() => (<Companies token={token}/>)} />
                  <Route exact path='/compare' component={() => (<Compare token={token} />)} />
                  <Route render={({ location }) => (['/login', '/signup', '/not-confirmed'].includes(location.pathname)) ?
                    <Redirect to='/dashboard' />
                    :
                    null
                  } />
                </Switch>
              </div>
            </div>
          </>
        }
      </Router>
    </div>
  );
}

export default App;
