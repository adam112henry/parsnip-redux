import React, { Component } from 'react';
import TaskList from './TaskList';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { createTask, editTask, filterTasks } from '../actions';
import { getGroupedAndFilteredTasks } from '../reducers';

class TasksPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showNewCardForm: false,
            title: '',
            description: '',
        };
    }

    onTitleChange = (e) => {
        this.setState({ title: e.target.value });
    }

    onDescriptionChange = (e) => {
        this.setState({ description: e.target.value });
    }

    resetForm() {
        this.setState({
            showNewCardForm: false,
            title: '',
            description: '',
        });
    }

    onCreateTask = (e) => {
        e.preventDefault();
        // this.props.onCreateTask({
        //     title: this.state.title,
        //     description: this.state.description,
        // });
        this.props.createTask({
            title: this.state.title,
            description: this.state.description,
            projectId: this.props.currentProjectId,
        });

        this.resetForm();
    }

    onStatusChange = (task, status) => {
        this.props.editTask(task, { status });
    };

    onSearch = (e) => {
        this.props.onSearch(e.target.value);
    }

    toggleForm = () => {
        this.setState({ showNewCardForm: !this.state.showNewCardForm });
    }

    renderTaskLists() { 
        //const { onStatusChange, tasks } = this.props;
        const { tasks } = this.props;
        
        return Object.keys(tasks).map(status => {
            const tasksByStatus = tasks[status];
            return (
                <TaskList
                    key={status}
                    status={status}
                    tasks={tasksByStatus}
                    onStatusChange={this.onStatusChange}
                />
            );
        });
    }

    render() {
        console.log('rendering TasksPage');

        if (this.props.isLoading) {
            return (
                <div className="tasks-loading">
                    Loading...
                </div>
            )
        }
        
        return (
            <div className='tasks'>
                <div className='tasks-header'>
                    <input
                        onChange={this.onSearch}
                        type="text"
                        placeholder='Search...'
                    />
                    <button className='button button-default' onClick={this.toggleForm}>
                        + New Task
                    </button>
                </div>

                {this.state.showNewCardForm && (
                    <form className='new-task-form' onSubmit={this.onCreateTask}>
                        <input
                            className='full-width-input'
                            onChange={this.onTitleChange}
                            value={this.state.title}
                            type='text'
                            placeholder='title'
                        />
                        <input
                            className='full-width-input'
                            onChange={this.onDescriptionChange}
                            value={this.state.description}
                            type='text'
                            placeholder='description'
                        />
                        <button
                            className='button'
                            type="submit"
                        >
                            Save
                        </button>
                    </form>
                )}

                <div className='task-lists'>
                    {this.renderTaskLists()}
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    const { isLoading } = state.projects;

    return {
        tasks: getGroupedAndFilteredTasks(state),
        currentProjectId: state.page.currentProjectId,
        isLoading,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(
        {
            onSearch: filterTasks,
            createTask,
            editTask,
        },
        dispatch,
    );
}

//export default TasksPage;
export default connect(mapStateToProps, mapDispatchToProps)(TasksPage);