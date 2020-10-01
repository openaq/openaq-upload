import React from 'react';
import { connect } from 'react-redux';

import auth from '../services/auth';

class UserAuth extends React.Component {
  login () {
    auth.login();
  }

  logout () {
    auth.logout();
  }

  render () {
    const isAuth = auth.isAuthenticated();
    const {
      name,
      picture
    } = (this.props.user.userProfile || {});

    return (
      <div className='user'>
        {isAuth && picture && <img src={picture} className='user__picture' alt='User image' />}
        {isAuth && name && <span>{name}</span>}
        {isAuth ? (
          <button type='button' className='btn--user-logout' onClick={this.logout}>Log out</button>
        ) : (
          <button type='button' className='btn--user-login' onClick={this.login}>Log in</button>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user
  };
};

const mapDispatchToProps = {
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserAuth);
