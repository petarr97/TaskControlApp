import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CodebookModel } from 'src/app/Models/codebook.model';
import config from '../../Config/backend.config.json';
import { HttpHeaders } from '@angular/common/http';
import { AuthService } from '../AuthService/auth.service';
import { AlertService } from '../AlertService/alert.service';

@Injectable({
  providedIn: 'root',
})
//genericka klasa za sifrarnike
export class CodebookService {
  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private alertService: AlertService
  ) {}
  //podaci
  backendConfig: any = config;

  //metoda za dohvatanje podataka sifrarnika
  async getCodebook(codebookApi: string): Promise<CodebookModel[]> {
    let codebookModel: CodebookModel[] = [];
    await this.http
      .get<any>(
        this.backendConfig.backendURL + codebookApi,
        this.authService.createOptions(null)
      )
      .toPromise()
      .then(
        (res) => {
          codebookModel = JSON.parse(res);
          return codebookModel;
        },
        (err) => {
          this.alertService.getSwal(
            'Greška',
            'Došlo je do greške',
            'error',
            null
          );
        }
      );
    return codebookModel;
  }
}
