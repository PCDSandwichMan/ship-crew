/* eslint-disable dot-notation */
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import axios from 'axios';
import jwtDecode from 'jwt-decode';

import { logoutUser } from './redux/actions/userActions';

// - Pages
import Home from './pages/Home';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';

// - Handles expired token management
const { token } = localStorage;
if (token) {
  const decodedToken = jwtDecode(token);
  if (decodedToken.exp * 1000 < Date.now()) {
    logoutUser();
  } else {
    axios.defaults.headers.common['Authorization'] = token;
  }
}

function App(props) {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/" component={Login} />
          <Route path="/password-recovery" component={ForgotPassword} />
          <Route path="/home" component={Home} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
