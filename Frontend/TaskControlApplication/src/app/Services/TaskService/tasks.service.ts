import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import config from '../../Config/backend.config.json';
import { BackendConfig } from 'src/app/Models/backend.config';
import { AuthService } from '../AuthService/auth.service';
import { Router } from '@angular/router';
import { TasksViewModel } from 'src/app/Models/tasks.view.model';
import { map } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { CreatTaskModel } from '../../Models/task.create.model';
import { AlertService } from '../AlertService/alert.service';

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router,
    private alertService: AlertService
  ) {}

  //podaci
  backendConfig: BackendConfig = config;
  params: HttpParams | null = null;
  transfTasks: TasksViewModel[] = [];
  tasksUpdated = new Subject<TasksViewModel[]>();
  taskModel: CreatTaskModel = {} as CreatTaskModel;

  getTasksUpdated = () => this.tasksUpdated.asObservable();
  clearParams = () => (this.params = null);
  goToTasks = () => this.router.navigateByUrl('tasks');

  createTask(taskModel: CreatTaskModel) {
    taskModel.userId = this.authService.getUserId();

    this.http
      .post(
        this.backendConfig.backendURL + this.backendConfig.taskApi,
        taskModel,
        this.authService.createOptions(null)
      )
      .toPromise()
      .then(
        (res) => {
          this.alertService.getSwal(
            'Čestitamo',
            'Uspješno ste kreirali novi zadatak',
            'success',
            this.goToTasks
          );
        },
        (err) => {
          this.alertService.getSwal(
            'Greška',
            'Zadatak nije uspjesno kreiran',
            'error',
            this.goToTasks
          );
        }
      );
  }

  updateTask(taskId: string | null, taskModel: CreatTaskModel) {
    if (taskId != null) {
      this.http
        .put(
          this.backendConfig.backendURL +
            this.backendConfig.taskApi +
            '/' +
            taskId,
          taskModel,
          this.authService.createOptions(null)
        )
        .toPromise()
        .then(
          (res) => {
            this.alertService.getSwal(
              'Čestitamo',
              'Uspješno ste izmjenili zadatak',
              'success',
              this.goToTasks
            );
          },
          (err) => {
            this.alertService.getSwal(
              'Greška',
              'Došlo je do greške!',
              'error',
              this.goToTasks
            );
          }
        );
    }
  }

  async getExistingTask(taskId: any): Promise<CreatTaskModel> {
    let params = new HttpParams().set('id', taskId);
    await this.http
      .get<any>(
        this.backendConfig.backendURL +
          this.backendConfig.taskApi +
          '/' +
          taskId,
        this.authService.createOptions(null)
      )
      .toPromise()
      .then((res) => {
        this.taskModel = JSON.parse(res);
        return this.taskModel;
      });
    return this.taskModel;
  }
  //metoda za brisanje
  deleteTask(taskId: any) {
    this.http
      .delete(
        this.backendConfig.backendURL +
          this.backendConfig.usersApi +
          '/' +
          taskId,
        this.authService.createOptions(null)
      )
      .toPromise()
      .then((res) => {
        this.tasksUpdated.next();
      });
  }
  getTasks() {
    let params = new HttpParams().set('userID', this.authService.getUserId());
    this.http
      .get<any>(
        this.backendConfig.backendURL + this.backendConfig.taskApi,
        this.authService.createOptions(params)
      )
      .pipe(
        map((mapdData) => {
          return mapdData;
        })
      )
      .subscribe((transfData) => {
        let tasks: any = JSON.parse(transfData);
        this.transfTasks = tasks;
        this.tasksUpdated.next([...this.transfTasks]);
      });
  }
}
