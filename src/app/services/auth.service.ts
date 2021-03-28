import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../auth/auth.interface';
import * as auth from '../store/actions/auth.actions';
import * as tasks from '../store/actions/tasks.actions';
import { AppState } from '../store/app.reducer';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _user: User;
  userSubscription = new Subscription();

  constructor(
    public auth: AngularFireAuth,
    private firestore: AngularFirestore,
    private store: Store<AppState>) { }


  initAuthListener() {
    this.auth.authState.subscribe(firebaseUser => {
      if (firebaseUser) {
        this.userSubscription = this.firestore.doc(`${firebaseUser.uid}/user`).valueChanges()
          .subscribe((user: User) => {
            this._user = user;
            this.store.dispatch(auth.setUser({ user }))
          })
      } else {
        this._user = null;
        this.userSubscription.unsubscribe();
        this.store.dispatch(tasks.unsetTasks())
        this.store.dispatch(auth.unsetUser())
      }
    })
  }

  signUp({ name, email, password }) {
    return this.auth.auth.createUserWithEmailAndPassword(email, password).then(({ user }) => {
      return this.firestore.doc(`${user.uid}/user`).set({
        uid: user.uid,
        name,
        email
      })
    });
  }

  login({ email, password }) {
    return this.auth.auth.signInWithEmailAndPassword(email, password);
  }

  logout() {
    this.store.dispatch(auth.unsetUser())
    return this.auth.auth.signOut();
  }

  isAuth() {
    return this.auth.authState.pipe(map(fbUser => fbUser !== null))
  }

  get user() {
    return { ...this._user };
  }
}
