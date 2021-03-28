import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { Task } from '../tasks/tasks.interface';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class TasksService {

  constructor(
    private firestore: AngularFirestore,
    private authService: AuthService
  ) { }

  /**
   * create new task
   * @param task data
   * @returns 
   */
  createTask(task: Task) {
    const { uid } = this.authService.user;
    return this.firestore.doc(`${uid}/tasks`).collection(`tasks`).add(task);
  }


  getTasks() {
    const { uid } = this.authService.user;
    return this.firestore.collection(`${uid}/tasks/tasks`)
      .snapshotChanges()
      .pipe(
        map(snapshot => snapshot.map(s => ({ uid: s.payload.doc.id, ...s.payload.doc.data() as any })))
      )
  }



  deleteTask(taskUid: string) {
    const { uid } = this.authService.user;
    return this.firestore.doc(`${uid}/tasks/tasks/${taskUid}`).delete()
  }

  editTaskWithBatch(tasks: Task[]) {
    const batch = this.firestore.firestore.batch()
    const { uid } = this.authService.user;
    tasks.forEach((task) => {
      const ref = this.firestore.firestore.doc(`${uid}/tasks/tasks/${task.uid}`);
      delete task.uid
      batch.update(ref, { ...task });
    })
    return batch.commit();
  }
}
