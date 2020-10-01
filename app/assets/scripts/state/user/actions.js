import * as constants from './constants';

export function loginUser (user) {
  return {
    type: constants.LOGIN_USER,
    data: user
  };
}

export function loginUserError (error) {
  return {
    type: constants.LOGIN_USER_ERROR,
    data: error
  };
}

export function logoutUser () {
  return {
    type: constants.LOGOUT_USER
  };
}
