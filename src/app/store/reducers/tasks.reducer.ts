import { createReducer, on } from '@ngrx/store';
import { Task } from '../../tasks/tasks.interface';
import { setTasks, unsetTasks } from '../actions/tasks.actions';

export interface State {
    tasks: Task[]
}

export const initialState: State = {
    tasks: []
};

const _tasksReducer = createReducer(
    initialState,
    on(setTasks, (state, { tasks }) => ({ ...state, tasks: [...tasks] })),
    on(unsetTasks, (state) => ({ ...state, tasks: [] }))
);

export function tasksReducer(state, action) {
    return _tasksReducer(state, action);
}