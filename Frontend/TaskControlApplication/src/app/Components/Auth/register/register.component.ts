import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/Services/AuthService/auth.service';
import { RegisterModel } from '../../../Models/register.model';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AlertService } from 'src/app/Services/AlertService/alert.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private router: Router,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.registerForm = this.createForm();
  }

  //podaci
  registerModel: RegisterModel = {
    email: '',
    password: '',
    name: '',
    surname: '',
    phonenumber: '',
  };
  passwordRepeat: string = '';
  loading: boolean = false;
  registerForm: FormGroup = {} as FormGroup;

  createForm(): FormGroup {
    return new FormGroup({
      email: new FormControl(null, {
        validators: [
          Validators.required,
          Validators.email,
          Validators.maxLength(50),
        ],
      }),
      password: new FormControl(null, {
        validators: [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(100),
        ],
      }),
      password2: new FormControl(null, {
        validators: [Validators.required],
      }),
      name: new FormControl(null, {
        validators: [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
        ],
      }),
      surname: new FormControl(null, {
        validators: [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
        ],
      }),
      phone: new FormControl(null, {
        validators: [
          Validators.required,
          Validators.pattern(
            '(([+][(]?[0-9]{1,3}[)]?)|([(]?[0-9]{4}[)]?))s*[)]?[-s.]?[(]?[0-9]{1,3}[)]?([-s.]?[0-9]{3})([-s.]?[0-9]{3,4})'
          ),
        ],
      }),
    });
  }

  register() {
    if (this.registerForm.invalid) {
      this.alertService.getSwal(
        'Neuspješna registracija',
        'Unesite ispravne podatke!',
        'error',
        null
      );
      return;
    }
    this.loading = true;
    this.checkPassword()
      ? this.authService
          .register(this.setRegisterModel(this.registerForm))
          .then(() => {
            this.loading = false;
          })
      : this.alertService.getSwal(
          'Greška',
          'Lozinka se ne poklapa',
          'error',
          (this.loading = false)
        );
  }
  goToLogin = () => this.router.navigateByUrl('login');

  checkPassword = (): boolean =>
    this.registerForm.controls['password'].value ==
    this.registerForm.controls['password2'].value
      ? true
      : false;
  setRegisterModel(form: FormGroup): RegisterModel {
    return {
      email: form.controls['email'].value,
      name: form.controls['name'].value,
      password: form.controls['password'].value,
      surname: form.controls['surname'].value,
      phonenumber: form.controls['phone'].value,
    };
  }
}
