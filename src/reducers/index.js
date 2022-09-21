import { uniqueId } from "../actions";

const mockTasks = [
    {
      id: uniqueId(),
      title: 'Learn Redux',
      description: 'The store, actions, and reducers, oh my!',
      status: 'In Progress',
    },
    {
      id: uniqueId(),
      title: 'Peace on Earth',
      description: 'No big deal',
      status: 'In Progress',
    },
    {
      id: uniqueId(),
      title: 'Todo',
      description: 'Wow, lot\'s of work',
      status: 'Unstarted',
    },
    {
      id: uniqueId(),
      title: 'My Work',
      description: 'All of the work in the world',
      status: 'Completed',
    },
  
];

export default function tasks(state = { tasks: mockTasks }, action) {
  if (action.type === 'CREATE_TASK') {
    return { 
      tasks: state.tasks.concat(action.payload) 
    };
  }
  if (action.type === 'EDIT_TASK') {
    const { payload } = action;
    return { 
      tasks: state.tasks.map(task => {
        if (task.id === payload.id) {
          return Object.assign({}, task, payload.params);
        }
        return task;
      }), 
    };
  }

  return state;
}