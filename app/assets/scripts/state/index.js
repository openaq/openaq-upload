import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import config from '../config';

import user from './user/reducers';
import uploadData from './upload/reducers'

const logger = createLogger({
  level: 'info',
  collapsed: true,
  predicate: (getState, action) => {
    return (config.environment !== 'production');
  }
});

const initialState = {};
const enhancers = [];
const middleware = [thunkMiddleware, logger];

// Dev Tools
if (process.env.NODE_ENV === 'development') {
  const devToolsExtension = window.__REDUX_DEVTOOLS_EXTENSION__;

  if (typeof devToolsExtension === 'function') {
    enhancers.push(devToolsExtension());
  }
}

const composedEnhancers = compose(
  applyMiddleware(...middleware),
  ...enhancers
);

const reducer = combineReducers({
  user,
  uploadData
});

const store = createStore(reducer, initialState, composedEnhancers);

export default store;
