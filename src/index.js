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

const store = createStore(tasks);
//const reducer = combineReducers({tasks: tasks});
//const store = configureStore(reducer);
//const store = configureStore({allReducers});

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

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
