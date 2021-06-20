import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../AuthService/auth.service';

@Injectable()
export class AuthCheck implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Observable<boolean> | Promise<boolean> | any {
    const isAuth = this.authService.getIsLoged();
    if (!isAuth) {
      this.router.navigate(['/login']);
    }
    return isAuth;
  }
}
