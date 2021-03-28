import { createAction, props } from '@ngrx/store';
import { Task } from '../../tasks/tasks.interface';

export const setTasks = createAction('[TASKS] Set Tasks', props<{ tasks: Task[] }>());
export const unsetTasks = createAction('[TASKS] Unset Tasks');