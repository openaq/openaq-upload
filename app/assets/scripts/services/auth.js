import auth0 from 'auth0-js';

import history from './history';
import config from '../config';
import store from '../state';
import { loginUser, loginUserError } from '../state/user/actions';

class Auth {
  constructor() {
    this.accessToken = null;
    this.idToken = null;
    this.userProfile = null;
    this.tokenRenewalTimeout = null;

    this.auth0 = new auth0.WebAuth({
      domain: config.auth.domain,
      clientID: config.auth.clientID,
      redirectUri: config.auth.callbackUrl,
      audience: config.auth.audience,
      responseType: 'token id_token',
      scope: 'openid profile'
    });

    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.handleAuthentication = this.handleAuthentication.bind(this);
    this.isAuthenticated = this.isAuthenticated.bind(this);
    this.getAccessToken = this.getAccessToken.bind(this);
    this.getIdToken = this.getIdToken.bind(this);
    this.renewSession = this.renewSession.bind(this);
    this.getProfile = this.getProfile.bind(this);
    this.getExpiryDate = this.getExpiryDate.bind(this);

    this.scheduleRenewal();
  }

  login() {
    this.auth0.authorize();
  }

  handleAuthentication() {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setSession(authResult);
        // navigate to the home route
        history.replace('/');
      } else if (err) {
        store.dispatch(loginUserError(err));
        history.replace('/');
      }
    });
  }

  getAccessToken() {
    return this.accessToken;
  }

  getIdToken() {
    return this.idToken;
  }

  getProfile() {
    return this.userProfile;
  }

  setSession(authResult) {
    // Set isLoggedIn flag in localStorage
    localStorage.setItem('isLoggedIn', 'true');
    // Set the time that the access token will expire at
    let expiresAt = (authResult.expiresIn * 1000) + new Date().getTime();
    this.accessToken = authResult.accessToken;
    this.idToken = authResult.idToken;
    this.userProfile = authResult.idTokenPayload;
    this.expiresAt = expiresAt;

    // Schedule a token renewal
    this.scheduleRenewal();

    store.dispatch(loginUser({
      accessToken: this.accessToken,
      idToken: this.idToken,
      userProfile: this.userProfile,
      expiresAt: this.expiresAt
    }));
  }

  renewSession() {
    this.auth0.checkSession({}, (err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setSession(authResult);
      } else if (err) {
        console.error('error renewing session', err);
        this.logout();
        store.dispatch(loginUserError(err));
      }
    });
  }

  logout() {
    // Remove tokens and expiry time
    this.accessToken = null;
    this.idToken = null;
    this.expiresAt = 0;

    // Remove user profile
    this.userProfile = null;

    // Clear token renewal
    clearTimeout(this.tokenRenewalTimeout);

    // Remove isLoggedIn flag from localStorage
    localStorage.removeItem('isLoggedIn');

    this.auth0.logout({
      returnTo: window.location.origin
    });

    // navigate to the home route
    history.replace('/');
  }

  isAuthenticated() {
    // Check whether the current time is past the
    // access token's expiry time
    let expiresAt = this.expiresAt;
    return new Date().getTime() < expiresAt;
  }

  scheduleRenewal() {
    let expiresAt = this.expiresAt;
    const timeout = expiresAt - Date.now();
    if (timeout > 0) {
      this.tokenRenewalTimeout = setTimeout(() => {
        this.renewSession();
      }, timeout);
    }
  }

  getExpiryDate() {
    return JSON.stringify(new Date(this.expiresAt));
  }
}

export default new Auth();
