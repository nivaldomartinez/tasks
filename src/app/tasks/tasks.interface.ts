export interface Task {
    uid: string;
    title: string;
    subtitle: string;
    status: 'new' | 'in progress' | 'done',
    order: number
}