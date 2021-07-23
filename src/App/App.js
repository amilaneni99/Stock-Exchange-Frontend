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
import { useState } from 'react';
import NotConfirmedUser from '../Components/Login/NotConfirmedUser';
import UserAuthService from './UserAuthService';


function App() {

  const {setUser, user} = UserAuthService();

  return (
    <div className="App">
      <Router>
        {
          !user && 
            <>
              <Route exact path='/login' component={() => (<Login setUser={setUser} />)} />
              <Route exact path='/signup' component={() => (<Signup setUser={setUser} />)} />
              {/* <Route exact path='/not-confirmed' component={NotConfirmedUser} /> */}
              <Route render={({location}) => (!(['/login','/signup','/not-confirmed'].includes(location.pathname))) ? 
                <Redirect to='/login' />
                :
                null
              } />
            </>
        }
        {
          user &&
          <>
            <Sidebar admin={user.admin}/>
            <div className="right">
              <Navbar initials={user.name.substring(0,2).toUpperCase()}/>
              <div className="content">
                <Switch>
                  <Route exact path='/' component={Dashboard} />
                  <Route exact path="/stockExchanges" component={StockExchanges} />
                  <Route exact path='/import' component={Import} />
                  <Route exact path='/companies/:id' component={CompanyData} />
                  <Route exact path='/companies' component={Companies} />
                  <Route exact path='/compare' component={Compare} />
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
