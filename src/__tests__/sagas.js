//import { call, put, delay } from 'redux-saga/effects';
import { handleProgressTimer } from '../sagas/sagas';

describe('sagas', () => {
    // it('handles the handleProgressTimer happy path', () => {
    //     const iterator = handleProgressTimer({
    //         type: 'TIMER_STARTED',
    //         payload: { taskId: 12 },
    //     });

    //     const expectedAction = {
    //         type: "TIMER_INCREMENT",
    //         payload: { taskId: 12 },
    //     };

    //     expect(iterator.next().value).toEqual(call(delay, 1000));
    //     expect(iterator.next().value).toEqual(put(expectedAction));
    //     expect(iterator.next().value).toEqual(call(delay, 1000));
    //     expect(iterator.next().value).toEqual(put(expectedAction));
    //     expect(iterator.next().done).toBe(false);
    // });

    it('handles the handleProgressTimer sad path', () => {
        const iterator = handleProgressTimer({
            type: 'TIMER_STOPPED',
        });

        expect(iterator.next().done).toBe(true);
    });
});