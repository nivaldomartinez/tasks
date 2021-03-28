import { ActionReducerMap } from "@ngrx/store";
import * as auth from "./reducers/auth.reducer";
import * as tasks from "./reducers/tasks.reducer";
import * as ui from './reducers/ui.reducer';

export interface AppState {
    ui: ui.State,
    auth: auth.State,
    tasks: tasks.State
}

export const appReducers: ActionReducerMap<AppState> = {
    ui: ui.uiReducer,
    auth: auth.authReducer,
    tasks: tasks.tasksReducer
}