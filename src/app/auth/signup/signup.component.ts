import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';
import * as ui from '../../store/actions/ui.actions';
import { AppState } from '../../store/app.reducer';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit, OnDestroy {

  signUpForm: FormGroup;
  storeSubscription = new Subscription();
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private store: Store<AppState>) {

    this.signUpForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    })
  }

  ngOnInit() {
    this.storeSubscription = this.store.select('ui').subscribe(({ isLoading }) => {
      this.isLoading = isLoading;
    })
  }

  ngOnDestroy() {
    this.storeSubscription.unsubscribe();
  }

  /**
   * create new user
   */
  signUp() {

    if (this.signUpForm.invalid || this.isLoading) { return }

    this.store.dispatch(ui.startLoading())

    this.authService.signUp(this.signUpForm.value).then(credentials => {

      Swal.fire({
        icon: 'success',
        title: 'Great!',
        text: 'User created successfully',
        confirmButtonColor: '#209cee'
      }).then(() => {
        this.router.navigate(['/app/tasks']);
      })
    }).catch(error => {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error.message,
        confirmButtonColor: '#209cee'
      })
    }).finally(() => this.store.dispatch(ui.stopLoading()))

  }
}
