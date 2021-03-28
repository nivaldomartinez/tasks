import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { CreateTaskComponent } from './components/create-task/create-task.component';
import { TasksComponent } from './tasks.component';

const routes: Routes = [
  {
    path: '', component: TasksComponent, children: [
      {
        path: 'task', component: CreateTaskComponent
      },
      {
        path: 'task/:status', component: CreateTaskComponent
      }
    ]
  }
]

@NgModule({
  declarations: [TasksComponent, CreateTaskComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    DragDropModule,
    ReactiveFormsModule
  ]
})
export class TasksModule { }
