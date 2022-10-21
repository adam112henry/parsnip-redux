import * as api from '../api';
import { normalize, schema } from 'normalizr';

const taskSchema = new schema.Entity('tasks');
const projectSchema = new schema.Entity('projects', {
    tasks: [taskSchema]
});

function receiveEntities(entities){
    return {
        type: 'RECEIVE_ENTITIES',
        payload: entities
    };
}

function fetchProjectsStarted(boards) {
    return {
        type: 'FETCH_PROJECTS_STARTED',
        payload: { boards }
    };
}

function fetchProjectsFailed(err) {
    return {
        type: 'FETCH_PROJECTS_FAILED',
        payload: err
    };
}

export function fetchProjects() {
    return (dispatch, getState) => {
        dispatch(fetchProjectsStarted());

        return api
            .fetchProjects()
            .then(resp => {
                //throw 'An error occurred. Could not load projects.';
                const projects = resp.data;
                const normalizedData = normalize(projects, [projectSchema]);

                dispatch(receiveEntities(normalizedData));

                if (!getState().page.currentProjectId) {
                    const defaultProjectId = projects[0].id;
                    dispatch(setCurrentProjectId(defaultProjectId));
                }
            })
            .catch(err => {
                console.error(err);
                dispatch(fetchProjectsFailed(err));
            });
    };
}

export function fetchTasks() {
    return {
        type: 'FETCH_TASKS_STARTED',
    };
}

export function createTaskRequested() {
    return {
        type: 'CREATE_TASK_REQUESTED'
    };
}

export function createTaskSucceeded(task) {
    return {
        type: 'CREATE_TASK_SUCCEEDED',
        payload: {
            task,
        },
    };
}

export function createTask ({ title, description, status = 'Unstarted' }) {
    return (dispatch, getState) => {
        dispatch(createTaskRequested());
        const projectId = getState().page.currentProjectId;

        api.createTask({ title, description, status, projectId })
            .then(resp => {
                dispatch(createTaskSucceeded(resp.data));
            });
    };
}

function editTaskSucceeded (task) {
    return {
        type: 'EDIT_TASK_SUCCEEDED',
        payload: {
            task,
        },
    };
}

export function editTask (task, params = {}) {
    return (dispatch) => {
        const updatedTask = {  
            ...task,
            ...params,
        };
        api.editTask(task.id, updatedTask)
            .then(resp => {
                dispatch(editTaskSucceeded(resp.data));
                if (resp.data.status === 'In Progress') {
                    return dispatch(progressTimerStart(resp.data.id));
                }
                
                if (task.status === 'In Progress') {
                    return dispatch(progressTimerStop(resp.data.id));
                }
            });
    };
}

function progressTimerStart(taskId) {
    return { 
        type: 'TIMER_STARTED',
        payload: { taskId }
    }
}

function progressTimerStop(taskId) {
    return { 
        type: 'TIMER_STOPPED',
        payload: { taskId }
    }
}

export function filterTasks(searchTerm) {
    return {
        type: 'FILTER_TASKS',
        payload: { searchTerm }       
    }
}

export function setCurrentProjectId(id) {
    return {
        type: 'SET_CURRENT_PROJECT_ID',
        payload: { id },
    };
}