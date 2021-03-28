import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { TasksService } from '../services/tasks.service';
import * as tasksActions from '../store/actions/tasks.actions';
import { AppState } from '../store/app.reducer';
import { Task } from './tasks.interface';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})
export class TasksComponent implements OnInit, OnDestroy {

  subscriptions: Subscription[] = [];

  tasks: Task[] = [];

  newTasks: Task[] = [];
  inProgressTasks: Task[] = [];
  doneTasks: Task[] = [];

  constructor(
    private store: Store<AppState>,
    private tasksService: TasksService,
    private router: Router) {

  }

  ngOnInit() {
    this.subscriptions.push(
      this.store.select('auth')
        .pipe(filter(({ user }) => user !== null))
        .subscribe(() => {
          this.subscriptions.push(
            this.tasksService.getTasks().subscribe(tasks => {
              this.store.dispatch(tasksActions.setTasks({ tasks }))
            })
          )
        })
    )

    this.subscriptions.push(
      this.store.select('tasks')
        .subscribe(({ tasks }) => {
          this.tasks = tasks;
          this.newTasks = this.getTaskByStatus('new');
          this.inProgressTasks = this.getTaskByStatus('in progress');
          this.doneTasks = this.getTaskByStatus('done');

        })
    )
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe())
  }

  /**
   * this filters tasks array by status
   * @param status 
   * @returns 
   */
  getTaskByStatus(status: string) {
    return this.tasks.filter(task => task.status === status.toLocaleLowerCase()).sort(
      (a, b) => {
        if (a.order < b.order) {
          return -1
        }

        if (a.order > b.order) {
          return 1
        }

        return 0
      }
    )
  }

  /**
   * this execute when the users drops a task
   * @param event CdkDragDrop event
   * @param status new task status
   */
  drop(event: CdkDragDrop<Task[]>, status: 'new' | 'in progress' | 'done') {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      this.editTask(
        event.container.data.map((task, i) => ({ ...task, order: i }))
      )
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);

      this.editTask(
        event.container.data.map((task, i) => ({ ...task, status, order: i }))
          .concat(event.previousContainer.data.map((task, i) => ({ ...task, order: i })))
      );
    }
    console.log(event);
  }

  /**
   * @param task 
   */
  deleteTask(task: Task) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#209cee',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.tasksService.deleteTask(task.uid).then(() => {
          Swal.fire({ icon: 'success', title: 'Success', text: 'Tasks deleted successfully', confirmButtonColor: '#209cee' })
        }).catch(error => Swal.fire({ icon: 'error', title: 'Error!', text: error.message }))
      }
    })
  }

  /**
   * @param task 
   */
  editTask(tasks: Task[]) {
    this.tasksService.editTaskWithBatch(tasks);
  }

  createTask(status: 'new' | 'in progress' | 'done') {
    this.router.navigate([`/app/tasks/task/${status}`])
  }

}
