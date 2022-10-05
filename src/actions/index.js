import * as api from '../api';

export function fetchTasks() {
    return {
        type: 'FETCH_TASKS_STARTED',
    };
}

// function fetchTasksSucceeded(tasks) {
//     return {
//         type: 'FETCH_TASKS_SUCCEEDED',
//         payload: {
//             tasks,
//         },
//     };
// }

// function fetchTasksFailed(error) {
//     return {
//         type: 'FETCH_TASKS_FAILED',
//         payload: {
//             error,
//         },
//     };
// }

// export function fetchTasks() {
//     return dispatch => {
//         dispatch(fetchTasksStarted());

//         api.fetchTasks()
//             .then(resp => {
//                 setTimeout(() => {
//                    dispatch(fetchTasksSucceeded(resp.data));
//                 }, 2000);
//                 //throw new Error("Oh no, unable to fetch tasks!!!");
//             })
//             .catch(err => {
//                 dispatch(fetchTasksFailed(err.message));
//             });
//     };
// };

function createTaskSucceeded(task) {
    return {
        type: 'CREATE_TASK_SUCCEEDED',
        payload: {
            task,
        },
    };
}

export function createTask ({ title, description, status = 'Unstarted' }) {
    return dispatch => {
        api.createTask({ title, description, status })
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

export function editTask (id, params = {}) {
    return (dispatch, getState) => {
        const task = getTaskById(getState().tasks.tasks, id);
        const updatedTask = {  
            ...task,
            ...params,
        };
        api.editTask(id, updatedTask)
            .then(resp => {
                dispatch(editTaskSucceeded(resp.data));
                if (resp.data.status === 'In Progress') {
                    return dispatch(progressTimerStart(resp.data.id));
                }
                
                if (task.status === 'In Progress') { // this is only efficient because currently only status is updateable
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

function getTaskById(tasks, id) {
    return tasks.find(task => task.id === id);
}