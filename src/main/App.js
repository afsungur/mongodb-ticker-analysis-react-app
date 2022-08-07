import React from 'react';
import 'fomantic-ui-css/semantic.css';
import * as Realm from "realm-web";
import { Switch, Route, Redirect} from 'react-router-dom';
// import Home from './Home';
import TickerAnalysisComponent from '../individual-currency/TickerAnalysisComponent'
import Rules from '../rules/Rules'
import ReportLastPrices from '../report/ReportLastPrices';
import ReportHourlyWinnersAndLosers from '../report/ReportHourlyWinnersLosers';
import ReportDailyWinnersAndLosers from '../report/ReportDailyWinnersLosers';
import TopMenu from './TopMenu'
import { Container } from 'semantic-ui-react';
const app = new Realm.App({ id: `${window['getConfig'].REALM_APP_ID}` });

function Login({ setUser }) {
  const loginAnonymous = async () => {
    const user = await app.logIn(Realm.Credentials.anonymous());
    setUser(user);
  };
  loginAnonymous()
  //return <button onClick={loginAnonymous}>Log In</button>;
  // auto logging
  return (<div>Logging in...</div>)
}


const App = () => {

  
  
    // Keep the logged in Realm user in local state. This lets the app re-render
    // whenever the current user changes (e.g. logs in or logs out).
    const [user, setUser] = React.useState(app.currentUser);
  
    // If a user is logged in, show their details.
    // Otherwise, show the login screen.
    return (
      <div>
        
          {user ? 
          <Container>
            <TopMenu user={user}/> 
            <Switch> {/* The Switch decides which component to show based on the current URL.*/}
            <Route exact path='/'><Redirect to="/currency" /></Route>
            <Route exact path='/currency' render={(props) => <TickerAnalysisComponent user={user} {...props} /> } ></Route>
            <Route exact path='/rules' render={(props) => <Rules user={user} {...props} /> } ></Route>
            <Route exact path='/reportLastPrices' render={(props) => <ReportLastPrices user={user} {...props} /> } ></Route>
            <Route exact path='/reportHourlyWinnersAndLosers' render={(props) => <ReportHourlyWinnersAndLosers user={user} {...props} /> } ></Route>
            <Route exact path='/reportDailyWinnersAndLosers' render={(props) => <ReportDailyWinnersAndLosers user={user} {...props} /> } ></Route>
            </Switch>
            <div style={{display:'none'}}>User id: {user.id}</div>
            </Container>
          : <Login setUser={setUser} />}
          
      </div>
    );
};
  
  

export default App;
