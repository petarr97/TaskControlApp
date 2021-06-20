import { Component, OnInit } from '@angular/core';
import { LoginModel } from 'src/app/Models/login.model';
import { AuthService } from 'src/app/Services/AuthService/auth.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router) {}
  loginModel: LoginModel = { email: '', password: '' };
  loading: boolean = false;

  ngOnInit(): void {
    if (this.authService.getIsLoged()) this.router.navigateByUrl('tasks');
  }

  //metode
  login() {
    this.loading = true;
    this.authService.login(this.loginModel).then(() => {
      this.loading = false;
      if (this.authService.getIsLoged()) this.router.navigateByUrl('tasks');
    });
  }
  register = () => this.router.navigateByUrl('register');
}
