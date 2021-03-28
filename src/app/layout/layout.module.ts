import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout.component';

const routes: Routes = [
  {
    path: '', component: LayoutComponent, children: [
      {
        path: 'tasks', loadChildren: () => import('../tasks/tasks.module').then(m => m.TasksModule)
      },
      {
        path: '', redirectTo: 'tasks', pathMatch: 'full'
      }
    ]
  }
]

@NgModule({
  declarations: [LayoutComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class LayoutModule { }
