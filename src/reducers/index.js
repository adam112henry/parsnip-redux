import { createSelector } from "reselect";
import { TASK_STATUSES } from "../constants";


const initialTasksState = {
  items: {},
  isLoading: false,
  error: null,
};

const initialProjectsState = {
  items: {},
  isLoading: false,
  error: null,
};

const initialPageState = {
  currentProjectId: null,
  searchTerm: '',
};

// reducers

export function tasks(state = initialTasksState, action) {
  switch (action.type) {
    case 'CREATE_TASK_SUCCEEDED':
    case 'EDIT_TASK_SUCCEEDED': {
      const { task } = action.payload;
      const nextTasks = {
        ...state.items,
        [task.id]: task,
      };

      return {
        ...state,
        items: nextTasks,
      };
    }
    case 'TIMER_INCREMENT': {
      // Todo: There is an issue here with type and relationship to object keys and array indices.
      // The tasks are array elements held in the 'items' object.
      // App will work fine as long as the task Ids are zero-based, otherwise need to fix below.
      const nextTasks = Object.keys(state.items).map(taskId => {
        const task = state.items[taskId];
        if (task.id === action.payload.taskId) {
          return {
            ...task,
            timer: task.timer + 1,
          };
        }

        return task;
      });
      
      return {
        ...state,
        items: nextTasks,
      };
    }
    case "RECEIVE_ENTITIES": {
      const { entities } = action.payload;
      if (entities && entities.tasks) {
        return {
          ...state,
          isLoading: false,
          items: entities.tasks,
        };
      }

      return state;
    }
    default: {
      return state;
    }
  }
}

export function projects(state = initialProjectsState, action) {
  switch (action.type) {
    case "RECEIVE_ENTITIES": {
      const { entities } = action.payload;
      if (entities && entities.projects) {
        return {
          ...state,
          isLoading: false,
          items: entities.projects,
        };
      }
      return state;
    }
    case 'FETCH_PROJECTS_STARTED': {
      return {
        ...state,
        isLoading: true,
      };
    }
    case 'CREATE_TASK_SUCCEEDED': {
      const { task } = action.payload;
      const project = state.items[task.projectId];

      return {
        ...state,
        items: {
          ...state.items,
          [task.projectId]: {
            ...project,
            tasks: project.tasks.concat(task.id),
          },
        },
      };
    }
    default: {
      return state;
    }
  }
}

export function page(state = initialPageState, action) {
  switch (action.type) {
    case 'SET_CURRENT_PROJECT_ID': {
      return {
        ...state,
        currentProjectId: action.payload.id,
      };
    }
    case 'FILTER_TASKS': {
      return {
        ...state,
        searchTerm: action.payload.searchTerm
      };
    }
    default: {
      return state;
    }
  }
}


// selectors
const getSearchTerm = state => state.page.searchTerm;

const getTasksByProjectId = state => {
  const { currentProjectId } = state.page;

  if (!currentProjectId || !state.projects.items[currentProjectId]) {
    return [];
  }

  const taskIds = state.projects.items[currentProjectId].tasks;
  return taskIds.map(id => state.tasks.items[id]);
};

export const getProjects = state => {
  return Object.keys(state.projects.items).map(id => {
    return state.projects.items[id];
  });
};

// These are memoized selectors because they use the createSelector() function
const getFilteredTasks = createSelector(
  [getTasksByProjectId, getSearchTerm],
  (tasks, searchTerm) => {
    return tasks.filter(task => task.title.match(new RegExp(searchTerm, 'i')));
  }
);

export const getGroupedAndFilteredTasks = createSelector(
  [getFilteredTasks],
  tasks => {
    const grouped = {};

    TASK_STATUSES.forEach(status => {
      grouped[status] = tasks.filter(task => task.status === status);
    });

    return grouped;
  }
);


