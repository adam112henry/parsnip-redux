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
import createSagaMiddleware from 'redux-saga';
import rootSaga from './sagas';
import reportWebVitals from './reportWebVitals';

const rootReducer = (state = {}, action) => {
  return {
    // This is sort of mis-named and a little confusing in the object hierarchy.
    // There is a parent 'tasks' object (the attribute below) that holds the root state.
    // Within that root state are children (tasks[], isLoading, error, searchTerm) where tasks[] is an 
    // array of objects that are the actual tasks, and the other scalar values apply across all tasks.
    tasks: tasksReducer(state.tasks, action),
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
