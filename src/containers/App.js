import '../assets/stylesheets/App.css';
import React, { Component } from 'react';
import TasksPage from '../components/TasksPage';
import Header from './Header';
import { connect } from 'react-redux';
//import { createTask, editTask, filterTasks, fetchProjects, setCurrentProjectId } from './actions';
import { createTask, editTask, filterTasks, fetchProjects } from '../actions';
import FlashMessage from '../components/FlashMessage';
//import { getGroupedAndFilteredTasks, getProjects } from './reducers';
import { getGroupedAndFilteredTasks } from '../reducers';

class App extends Component {
  componentDidMount() {
    this.props.dispatch(fetchProjects());
  }

  onCreateTask = ({ title, description }) => {
    this.props.dispatch(createTask({ title, description }));
  };

  onStatusChange = ( task, status ) => {
    this.props.dispatch(editTask(task, { status }));
  };

  onSearch = searchTerm => {
    this.props.dispatch(filterTasks(searchTerm));
  };

  // onCurrentProjectChange = e => {
  //   this.props.dispatch(setCurrentProjectId(Number(e.target.value)));
  // };
  
  render() {
    //console.log('props from the App: ', this.props)
    return (
      <div className='container'>
        {this.props.error && <FlashMessage message={this.props.error} />}
        <div className='main-content'>
          {/* Demonstrates 2 examples - Header is now a "connected" (container) component, which allows some optimizations.
          TasksPage remains as a "presentational" component. */}
          {/* <Header
            projects={this.props.projects}
            onCurrentProjectChange={this.onCurrentProjectChange}
          /> */}
          <Header/>
          <TasksPage 
            tasks={this.props.tasks} 
            onCreateTask={this.onCreateTask}  
            onStatusChange={this.onStatusChange}  
            onSearch={this.onSearch}
            isLoading={this.props.isLoading}
          />
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { isLoading, error } = state.projects;
  return {
    tasks: getGroupedAndFilteredTasks(state),
    //projects: getProjects(state), 
    isLoading,
    error
  };
}

// 'connect' passes dispatch to the called component
export default connect(mapStateToProps) (App);