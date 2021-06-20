import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from './Services/AuthService/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'TaskControlSystem';

  constructor(private authService: AuthService, private router: Router) {}
  isLoged: boolean = false;
  authListenerSub: Subscription = {} as Subscription;

  ngOnInit() {
    this.isLoged = this.authService.getIsLoged();

    this.authListenerSub = this.authService
      .getAuthListener()
      .subscribe((isLoged) => {
        this.isLoged = isLoged;
      });
    this.authService.goToLogin();
  }
  ngOnDestroy() {
    this.authListenerSub.unsubscribe();
  }
  logout = () => this.authService.logout();
}
