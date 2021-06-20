import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { CreatTaskModel } from '../../../Models/task.create.model';
import { TasksService } from 'src/app/Services/TaskService/tasks.service';
import { CodebookService } from 'src/app/Services/CodebookService/codebook.service';
import { BackendConfig } from 'src/app/Models/backend.config';
import config from '../../../Config/backend.config.json';
import { CodebookModel } from 'src/app/Models/codebook.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/Services/AuthService/auth.service';
import { AlertService } from 'src/app/Services/AlertService/alert.service';

@Component({
  selector: 'app-create-task',
  templateUrl: './create-task.component.html',
  styleUrls: ['./create-task.component.css'],
})
export class CreateTaskComponent implements OnInit {
  constructor(
    private taskService: TasksService,
    private codebookService: CodebookService,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private alertService: AlertService
  ) {}

  //podaci
  taskModel: CreatTaskModel = {
    statusId: 0,
    priorityId: 0,
    endDate: null,
    solvingType: null,
    elapsedTime: null,
  } as CreatTaskModel;

  loading: boolean = true;
  statusList: CodebookModel[] = [];
  priorityList: CodebookModel[] = [];
  isEdit: boolean = false;
  title: string = '';
  taskId: string | null = null;
  taskForm: FormGroup = {} as FormGroup;

  //konfiguracioni
  backendConfig: BackendConfig = config;

  ngOnInit(): void {
    this.taskForm = this.createForm();
    this.activatedRoute.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('taskId')) {
        if (paramMap.get('taskId') === '0') {
          this.title = 'Kreiraj novi zadatak';
          this.isEdit = false;
          this.setDefaultFormValue(this.taskForm);
        } else {
          this.title = 'Izmjeni postojeći zadatak';
          this.isEdit = true;
          this.taskId = paramMap.get('taskId');
          this.getExistingTask(this.taskId).then(() => {});
        }
        this.loading = false;
      }
    });
    this.getCodebooks();
  }

  //metoda za kreiranje forme sa validatorima
  createForm(): FormGroup {
    return new FormGroup({
      Name: new FormControl(null, {
        validators: [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(100),
        ],
      }),
      Description: new FormControl(null, {
        validators: [
          Validators.required,
          Validators.maxLength(500),
          Validators.minLength(10),
        ],
      }),
      Note: new FormControl(null, {
        validators: [
          Validators.required,
          Validators.maxLength(200),
          Validators.minLength(10),
        ],
      }),
      ElapsedTime: new FormControl(null, {
        validators: [Validators.pattern('^[0-9]*$')],
      }),
      SolvingType: new FormControl(null, {}),
      StatusId: new FormControl(null, {
        validators: [Validators.required],
      }),
      PriorityId: new FormControl(null, {
        validators: [Validators.required],
      }),
      StartDate: new FormControl(null, {
        validators: [Validators.required],
      }),
      EndDate: new FormControl(null, {}),
    });
  }
  //kreiranje novog zadatka
  createTask() {
    if (this.taskForm.invalid) {
      this.alertService.getSwal('Greška', 'Neispravni podaci!', 'error', null);
      return;
    }
    this.taskService.createTask(this.createModelfromForm(this.taskForm, false));
  }

  getStatuses() {
    this.codebookService
      .getCodebook(this.backendConfig.statusApi)
      .then((res) => {
        this.statusList = res;
      });
  }

  getPriorities() {
    this.codebookService
      .getCodebook(this.backendConfig.prioritiesApi)
      .then((res) => {
        this.priorityList = res;
      });
  }

  getCodebooks() {
    this.getStatuses();
    this.getPriorities();
  }

  async getExistingTask(taskId: any) {
    await this.taskService.getExistingTask(taskId).then((res) => {
      this.taskModel = res;
      this.setExistingTaskFormValue(this.taskForm, this.taskModel);
    });
  }

  editTask() {
    if (this.taskForm.invalid) {
      this.alertService.getSwal('Greška', 'Neispravni podaci!', 'error', null);
      return;
    }
    if (
      !this.checkDates(
        this.taskForm.controls['StartDate'].value,
        this.taskForm.controls['EndDate'].value
      )
    ) {
      this.alertService.getSwal(
        'Greška',
        'Krajnji datum ne može biti manji od početnog!',
        'error',
        null
      );
      return;
    }

    this.taskService.updateTask(
      this.taskId,
      this.createModelfromForm(this.taskForm, true)
    );
  }

  dateToString = (date: NgbDateStruct): string => {
    return date.year + '-' + date.month + '-' + date.day;
  };

  //konverzija datuma koji dobijemo sa bekenda u  strukturu datuma koja se koristi na formi
  setDate(date: Date | null): NgbDateStruct {
    if (date != null) {
      var newDate = new Date(date);

      return {
        year: newDate.getFullYear(),
        month: newDate.getMonth() + 1,
        day: newDate.getDate(),
      };
    }
    return {} as NgbDateStruct;
  }

  isEmptyObj(object: any): boolean {
    for (var key in object) {
      if (object.hasOwnProperty(key)) {
        return false;
      }
    }
    return true;
  }

  //kreiranje modela koji se salje na bekend
  createModelfromForm(form: FormGroup, editMode: boolean): CreatTaskModel {
    let endDate: Date | null;
    let taskId: string | null;
    if (!editMode) {
      endDate = null;
      taskId = '0';
    } else {
      if (form.controls['EndDate'].value != null)
        endDate = new Date(this.dateToString(form.controls['EndDate'].value));
      else endDate = null;
      taskId = this.taskId;
    }
    return {
      name: form.controls['Name'].value,
      description: form.controls['Description'].value,
      note: form.controls['Note'].value,
      statusId: form.controls['StatusId'].value,
      elapsedTime: form.controls['ElapsedTime'].value,
      priorityId: form.controls['PriorityId'].value,
      startDate: new Date(this.dateToString(form.controls['StartDate'].value)),
      endDate: endDate,
      solvingType: form.controls['SolvingType'].value,
      userId: this.authService.getUserId(),
      taskId: taskId,
    };
  }

  //podesavanje defaultnih vrijednosti forme
  setDefaultFormValue(form: FormGroup) {
    form.setValue({
      Name: '',
      Description: '',
      Note: '',
      ElapsedTime: '',
      StatusId: 0,
      PriorityId: 0,
      StartDate: null,
      EndDate: null,
      SolvingType: null,
    });
  }
  //podesavanje forme iz modela koji dobijemo sa bekenda
  setExistingTaskFormValue(form: FormGroup, taskModel: CreatTaskModel) {
    let endDate: NgbDateStruct | null;
    if (taskModel.endDate != null) endDate = this.setDate(taskModel.endDate);
    else endDate = null;
    form.setValue({
      Name: taskModel.name,
      Description: taskModel.description,
      Note: taskModel.note,
      ElapsedTime: taskModel.elapsedTime,
      StatusId: taskModel.statusId,
      PriorityId: taskModel.priorityId,
      StartDate: this.setDate(taskModel.startDate),
      EndDate: endDate,
      SolvingType: taskModel.solvingType,
    });
  }

  checkDates(startDate: NgbDateStruct, endDate: NgbDateStruct): boolean {
    if (endDate != null) {
      if (
        new Date(startDate.year, startDate.month - 1, startDate.day).getTime() <
        new Date(endDate.year, endDate.month - 1, endDate.day).getTime()
      )
        return true;
      return false;
    }
    return true;
  }
}
