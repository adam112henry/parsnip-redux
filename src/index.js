import React from 'react';
import ReactDOM from 'react-dom';
//import { createStore } from 'redux';
import { legacy_createStore as createStore, applyMiddleware } from 'redux';
//import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
//import tasks from './reducers';
import tasksReducer from './reducers';
import App from './App';
import './index.css';
import reportWebVitals from './reportWebVitals';
import logger from './middleware/logger';
import analytics from './middleware/analytics';
import apiMiddleware from './middleware/api';

const rootReducer = (state = {}, action) => {
  return {
    tasks: tasksReducer(state.tasks, action),
  };
};

const store = createStore(
  rootReducer, 
  composeWithDevTools(applyMiddleware(thunk, apiMiddleware, logger, analytics)));
//const reducer = combineReducers({tasks: tasks});
//const store = configureStore(reducer);
//const store = configureStore({allReducers});

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

if (module.hot) {
  module.hot.accept('./App', () => {
    const NextApp = require('./App').default;
    ReactDOM.render(
      <Provider store={store}><NextApp /></Provider>, 
      document.getElementById('root')
    );
  });

  module.hot.accept('./reducers', () => {
    const nextRootReducer = require('./reducers').default;
    store.replaceReducer(nextRootReducer);
  });
}


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
