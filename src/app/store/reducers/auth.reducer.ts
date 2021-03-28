import { createReducer, on } from '@ngrx/store';
import { User } from '../../auth/auth.interface';
import { setUser, unsetUser } from '../actions/auth.actions';

export interface State {
    user: User
}

export const initialState: State = {
    user: null
};

const _authReducer = createReducer(
    initialState,
    on(setUser, (state, { user }) => ({ ...state, user: { ...user } })),
    on(unsetUser, (state) => ({ ...state, user: null }))
);

export function authReducer(state, action) {
    return _authReducer(state, action);
}