import React from 'react';
import ReactDOM from 'react-dom';
//import { createStore } from 'redux';
import { legacy_createStore as createStore } from 'redux';
//import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import tasks from './reducers'
import App from './App';
import './index.css';
//import allReducers from './reducers/index';
import reportWebVitals from './reportWebVitals';
import { devToolsEnhancer } from 'redux-devtools-extension';

const store = createStore(tasks, devToolsEnhancer());
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


// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
