import React from 'react';
import { withRouter } from 'react-router-dom';

import auth from '../services/auth';

class App extends React.Component {
  componentDidUpdate (prevProps) {
    if (this.props.location.pathname !== prevProps.location.pathname) {
      window.scrollTo(0, 0);
    }
  }

  componentDidMount () {
    if (localStorage.getItem('isLoggedIn') === 'true') {
      // In case there is any error, on next load the user will be logged out.
      localStorage.setItem('isLoggedIn', 'false');
      // Once the session is renewed, the flag will be set again.
      auth.renewSession();
    }
  }

  render () {
    return (
      <div className='app-container'>
        {this.props.children}
      </div>
    );
  }
}

export default withRouter(App);
