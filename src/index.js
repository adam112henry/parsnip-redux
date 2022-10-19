import React from 'react';
import ReactDOM from 'react-dom';
//import { createStore } from 'redux';
import { legacy_createStore as createStore, applyMiddleware } from 'redux';
//import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import { projects, tasks, page } from './reducers';
import App from './containers/App';
import './assets/stylesheets/index.css';
import createSagaMiddleware from 'redux-saga';
import rootSaga from './sagas/sagas';
import reportWebVitals from './reportWebVitals';

const rootReducer = (state = {}, action) => {
  return {
    projects: projects(state.projects, action),
    tasks: tasks(state.tasks, action),
    page: page(state.page, action)
  };
};

// initiate the saga
const sagaMiddleware = createSagaMiddleware();

const store = createStore(
  rootReducer, 
  composeWithDevTools(applyMiddleware(thunk, sagaMiddleware)));
//const reducer = combineReducers({tasks: tasks});
//const store = configureStore(reducer);
//const store = configureStore({allReducers});

sagaMiddleware.run(rootSaga);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

if (module.hot) {
  module.hot.accept('./containers/App', () => {
    const NextApp = require('./containers/App').default;
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
