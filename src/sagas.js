import { call, put, takeLatest, delay, take } from 'redux-saga/effects';
import { channel } from 'redux-saga';
import * as api from './api';

/***
 * Sagas use generators, which allow a function to be paused and resumed.
 * A generator returns an iterator.
 * Think of sagas as background processes or subprograms.
 * async/await leverages generators to create another way to handle asynchronous events.
 */

export default function* rootSaga() {
    // Spin up multiple watchers using the fork function
    //yield fork(watchFetchTasks);
    //yield fork(watchSomethingElse);
    yield takeLatest('FETCH_TASKS_STARTED', fetchTasks);
    //yield takeEvery('TIMER_STARTED', handleProgressTimer);
    //yield takeLatestById('TIMER_STARTED', handleProgressTimer);
    yield takeLatestById(['TIMER_STARTED', 'TIMER_STOPPED'], handleProgressTimer);
}

function* takeLatestById(actionTypes, saga) {
    const channelsMap = {};  // this will only be hit once, when the root saga is executed

    while (true) {  // this loop will run forever
        // this will be called whenever a TIMER_STARTED action occurs, because of the generator/saga
        const action = yield take(actionTypes);  // this will 'take' the current action
        const { taskId } = action.payload;

        if (!channelsMap[taskId]) {
            channelsMap[taskId] = channel();
            yield takeLatest(channelsMap[taskId], saga); // this will grab the channel associated with task
        }

        yield put(channelsMap[taskId], action);
    }
}

// Each watcher is also a generator
// Although they're not 'watchers' anymore since that 'watching' is now occurring above in the root saga

export function* handleProgressTimer({ payload, type }) {
    if (type === 'TIMER_STARTED') {
        while (true) {
            yield delay(1000);
            yield put({
                type: 'TIMER_INCREMENT',
                payload: { taskId: payload.taskId },
            });
        }
    }
}

function* fetchTasks() {
    try {
        //console.log('watching tasks!');
        const { data } = yield call(api.fetchTasks);
        yield put({
            type: 'FETCH_TASKS_SUCCEEDED',
            payload: { tasks: data }
        });
    } catch (e) {
        yield put ({
            type: 'FETCH_TASKS_FAILED',
            payload: { error: e.message }
        });
    }        
}