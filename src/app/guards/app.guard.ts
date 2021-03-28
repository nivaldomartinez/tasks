import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AppGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {

  }

  canActivate() {
    return this.authService.isAuth().pipe(
      tap(isAuth => {
        if (!isAuth) { this.router.navigate(['/']) }
      })
    );
  }

}
