//import configureMockStore from 'redux-mock-store';
//import thunk from 'redux-thunk';
//import { createTask, createTaskSucceeded } from "../actions";
import { createTaskSucceeded } from "../actions";
import * as api from '../api';

jest.unmock('../api');
api.createTask = jest.fn(
    () => new Promise((resolve, reject) => resolve({ data: 'foo' })),
);

//const middlewares = [thunk];
//const mockStore = configureMockStore(middlewares);

describe('action creators', () => {
    it('should handle successful task creation', () => {
        const task = { title: 'Do this', description: "How?" };
        const expectedAction = { type: 'CREATE_TASK_SUCCEEDED', payload: { task } };
        expect(createTaskSucceeded(task)).toEqual(expectedAction);
    }); 
});

// describe('createTask', () => {
//     it('works', () => {
//         const expectedActions = [
//             { type: 'CREATE_TASK_STARTED' },
//             { type: 'CREATE_TASK_SUCCEEDED', payload: { task: 'foo' } },
//         ];

//         const store = mockStore({
//             tasks: {
//                 tasks: [],
//             },
//         });

//         return store.dispatch(createTask({})).then(() => {
//             expect(store.getActions()).toEqual(expectedActions);
//             expect(api.createTask).toHaveBeenCalled();
//         });
//     });
// });