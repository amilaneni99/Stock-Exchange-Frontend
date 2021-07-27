import './App.css';
import Login from '../Components/Login/Login';
import Signup from '../Components/Signup/Signup';
import useToken from './UserAuthService';
import Sidebar from '../Sidebar/Sidebar';
import Navbar from './Navbar/Navbar';
import { Route, BrowserRouter as Router, Switch, BrowserRouter, Redirect } from 'react-router-dom';
import Import from '../Components/Import/Import';
import Companies from '../Components/Companies/Companies';
import StockExchanges from '../StockExchanges/StockExchanges';
import CompanyData from '../Components/Companies/CompanyData';
import Compare from '../Components/Compare/Compare';
import PrivateRoute from './PrivateRoute';
import { useEffect, useState } from 'react';
import NotConfirmedUser from '../Components/Login/NotConfirmedUser';
import UserAuthService from './UserAuthService';
import Dashboard from '../Components/Dashboard/Dashboard';
import Profile from '../Components/Profile/Profile';
import { createTheme } from '@material-ui/core';

function App() {

  const {setUser, user, setToken, token} = UserAuthService();
  const userObj = JSON.parse(user);
  const allowedRoutesByUser = ['/profile', '/companies', '/companies/:id', 'stockExchanges', '/compare'];
  const allowedRoutesByAdmin = allowedRoutesByUser.concat(['/import']); 

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
            <Sidebar admin={userObj.admin}/>
            <div className="right">
              <Navbar initials={userObj.name.substring(0,2).toUpperCase()}/>
              <div className="content">
                <Switch>
                  <Route exact path="/profile" component={() => (<Profile setUser={setUser} setToken={setToken} token={token} user={userObj} />)} />
                  <Route exact path='/dashboard' component={() => (<Dashboard token={token}/>)} />
                  <Route exact path="/stockExchanges" component={() => (<StockExchanges setToken={setToken} user={userObj} token={token}/>)} />
                  {
                    userObj.admin &&
                    <Route exact path='/import' component={() => (<Import token={token}/>)} />
                  }
                  <Route exact path='/companies/:id' component={(matchProps) => (<CompanyData {...matchProps} token={token} user={userObj}/>)} />
                  <Route exact path='/companies' component={() => (<Companies token={token} user={userObj} setToken={setToken}/>)} />
                  <Route exact path='/compare' component={() => (<Compare token={token} />)} />
                  <Route render={({ location }) => (!(userObj.admin? allowedRoutesByAdmin:allowedRoutesByUser).includes(location.pathname)) ?
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
