import { Injectable } from '@angular/core';
import { BackendConfig } from 'src/app/Models/backend.config';
import { LoginModel } from 'src/app/Models/login.model';
import config from '../../Config/backend.config.json';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AuthModel } from '../../Models/auth.model';
import { map } from 'rxjs/operators';
import { RegisterModel } from 'src/app/Models/register.model';
import { RegisterResponseModel } from 'src/app/Models/register.response.model';
import { HttpParams } from '@angular/common/http';
import { AlertService } from '../AlertService/alert.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private http: HttpClient,
    private router: Router,
    private alertService: AlertService
  ) {}

  //podaci
  authModel: AuthModel = { UserId: 0, Name: '', Token: '' };
  backendConfig: BackendConfig = config;
  isLoged = false;
  authListener = new Subject<boolean>();

  getIsLoged = () => this.isLoged;
  getUserId = () => this.authModel.UserId;
  getAuthListener = () => this.authListener.asObservable();
  goToLogin = () => this.router.navigateByUrl('login');

  async login(loginModel: LoginModel) {
    await this.http
      .post<any>(
        this.backendConfig.backendURL +
          this.backendConfig.usersApi +
          '/authenticate',
        loginModel,
        this.createOptions(null)
      )
      .toPromise()
      .then(
        (res) => {
          let authModel: any = JSON.parse(res);
          this.authModel = authModel;
          this.isLoged = true;
          this.authListener.next(true);
        },
        (err) => {
          this.alertService.getSwal(
            'Greška',
            'Korisničko ime ili lozinka nisu ispravni',
            'error',
            null
          );
          this.authListener.next(false);
        }
      );
  }

  async register(registerModel: RegisterModel) {
    this.http
      .post<any>(
        this.backendConfig.backendURL + this.backendConfig.usersApi,
        registerModel,
        this.createOptions(null)
      )
      .toPromise()
      .then(
        (res) => {
          var response: RegisterResponseModel = JSON.parse(res);
          if (response.error)
            this.alertService.getSwal(
              'Greška',
              'Korisnik sa emailom: ' +
                registerModel.email +
                ' već postoji u bazi podataka!',
              'error',
              null
            );
          else {
            this.alertService.getSwal(
              'Čestitamo',
              'Uspješno ste se registrovali na sistem',
              'success',
              this.goToLogin
            );
          }
        },
        (err) => {
          this.alertService.getSwal(
            'Greška',
            'Neuspješna registracija',
            'error',
            null
          );
        }
      );
  }

  logout() {
    this.alertService
      .getSwalConfirm(
        'Pitanje',
        'Da li ste sigurni da želite da se odjavite sa sistema?',
        'info',
        this.goToLogin,
        null
      )
      .then((res) => {
        if (res == 'ok') {
          this.clearUserData();
        }
      });
  }

  createOptions(par: HttpParams | null) {
    return new Object({
      params: par,
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.authModel.Token,
      }),
      responseType: 'text',
    });
  }

  clearUserData() {
    this.authModel.Name = '';
    this.authModel.Token = '';
    this.authModel.UserId = 0;
    this.isLoged = false;
    this.authListener.next(false);
  }
}
