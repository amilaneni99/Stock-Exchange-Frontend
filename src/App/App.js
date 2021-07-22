import './App.css';
import Login from '../Components/Login/Login';
import Signup from '../Components/Signup/Signup';
import useToken from './useToken';
import Sidebar from '../Sidebar/Sidebar';
import Navbar from './Navbar/Navbar';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import { Dashboard } from '@material-ui/icons';
import Import from '../Components/Import/Import';
import Companies from '../Components/Companies/Companies';
import StockExchanges from '../StockExchanges/StockExchanges';
import CompanyData from '../Components/Companies/CompanyData';
import Compare from '../Components/Compare/Compare';


function App() {
  const { token, setToken } = useToken();

  if (!token) {
    return <Login setToken={setToken} />
  }

  return (
    <div className="App">
      <Router>
        <Sidebar/>
        <div className="right">
          <Navbar />
          <div className="content">
            <Switch>
              <Route path='/' exact component={Dashboard} />
              <Route path="/stockExchanges" component={StockExchanges} />
              <Route path='/import' component={Import} />
              <Route exact path='/companies/:id' component={CompanyData} />
              <Route exact path='/companies' component={Companies} />
              <Route exact path='/compare' component={Compare} />
            </Switch>
          </div>
        </div>
      </Router>
    </div>
  );
}

export default App;
