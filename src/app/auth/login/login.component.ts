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
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  loginForm: FormGroup;
  storeSubscription = new Subscription();
  isLoading = false;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService,
    private store: Store<AppState>) {

    this.loginForm = this.fb.group({
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
   * login user
   */
  login() {
    if (this.loginForm.invalid || this.isLoading) { return }

    this.store.dispatch(ui.startLoading())

    this.authService.login(this.loginForm.value).then(credentials => {
      this.router.navigate(['/app/tasks'])
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
