import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { TasksService } from 'src/app/services/tasks.service';
import { AppState } from 'src/app/store/app.reducer';
import Swal from 'sweetalert2';
import * as ui from '../../../store/actions/ui.actions';

@Component({
  selector: 'app-create-task',
  templateUrl: './create-task.component.html',
  styleUrls: ['./create-task.component.scss']
})
export class CreateTaskComponent implements OnInit {

  taskForm: FormGroup;
  isLoading = false;
  storeSubscription = new Subscription()

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private store: Store<AppState>,
    private router: Router,
    private tasksService: TasksService) {

    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      subtitle: ['', Validators.required],
      status: ['', Validators.required],
      order: [0]
    })
  }

  ngOnInit() {
    const statusFromUrl = this.route.snapshot.paramMap.get('status')
    if (statusFromUrl) {
      this.taskForm.patchValue({
        status: statusFromUrl
      })
    }

    this.storeSubscription = this.store.select('ui').subscribe(({ isLoading }) => {
      this.isLoading = isLoading;
    })
  }


  createTask() {
    if (this.taskForm.invalid || this.isLoading) { return }


    this.store.dispatch(ui.startLoading());
    this.tasksService.createTask(this.taskForm.value).then(() => {
      this.store.dispatch(ui.stopLoading())
      this.router.navigate(['/app/tasks'])
    }).catch(error => {
      this.store.dispatch(ui.stopLoading())
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: error.message,
        confirmButtonColor: '#209cee'
      })
    });
  }

}
