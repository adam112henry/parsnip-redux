import './App.css';
import React, { Component } from 'react';
import TasksPage from './components/TasksPage';
import { connect } from 'react-redux';
import { createTask, editTask } from './actions';

class App extends Component {
  onCreateTask = ({ title, description }) => {
    this.props.dispatch(createTask({ title, description }));
  };

  onStatusChange = ( id, status ) => {
    this.props.dispatch(editTask(id, {status}));
  };
  
  render() {
    //console.log('props from the App: ', this.props)
    return (
      <div className='main-content'>
        <TasksPage 
          tasks={this.props.tasks} 
          onCreateTask={this.onCreateTask}  
          onStatusChange={this.onStatusChange}  
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    tasks: state.tasks,
  };
}

export default connect(mapStateToProps) (App);

/* function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        hello
      </header>
    </div>
  );
} */

//export default App;
