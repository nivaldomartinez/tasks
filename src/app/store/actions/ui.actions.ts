import { createAction } from '@ngrx/store';

export const startLoading = createAction('[UI Component] Start Loading');
export const stopLoading = createAction('[UI Component] Stop Loading');