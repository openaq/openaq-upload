import React, { Component } from 'react';
import { render } from 'react-dom';
import { Provider, connect } from 'react-redux';
import { Router, Route, Switch } from 'react-router-dom';

import App from './views/app';
import NoMatch from './views/404';
import Home from './views/home';
import CreateAccount from './views/apply';
import Format from './views/format';
import Callback from './views/callback';
import GlobalMessage from './views/global-message';

import store from './state';
import history from './services/history';
import auth from './services/auth';

const handleAuthentication = ({ location }) => {
  if (/access_token|id_token|error/.test(location.hash)) {
    auth.handleAuthentication();
  }
};

// The Private route has to be connected to the state to ensure it refreshes
// once the user logs in. Otherwise we'd see only the Login page.
const PrivateRoute = connect(
  state => ({
    user: state.user
  }),
  {}
)(props => {
  const { component: Component, user, ...rest } = props;
  return (
    <Route
      {...rest}
      render={props => {
        if (user.error) {
          return (
            <GlobalMessage>An error occurred while logging in: {user.error.errorDescription}</GlobalMessage>
          );
        }

        if (!auth.isAuthenticated()) {
          return (
            <GlobalMessage>Please log in to access this page.</GlobalMessage>
          );
        }

        const metadata = user.userProfile['http://openaq.org/user_metadata'];
        if (!metadata || !metadata.active) {
          return (
            <GlobalMessage>
              <p>Your account has to be activated by an administrator.</p>
              <p>Please come back later.</p>
            </GlobalMessage>
          );
        }
        return <Component {...props} />;
      }}
    />
  );
});

class Root extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router history={history}>
          <App>
            <Switch>
              <Route exact path='/' component={Home} />
              <Route exact path='/account' component={CreateAccount} />
              <Route exact path='/format' component={Format} />
              <Route
                path='/callback'
                render={props => {
                  handleAuthentication(props);
                  return <Callback {...props} />;
                }}
              />
              <Route component={NoMatch} />
            </Switch>
          </App>
        </Router>
      </Provider>
    );
  }
}

render(<Root />, document.querySelector('#app'));
