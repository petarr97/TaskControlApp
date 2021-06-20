import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { TasksViewModel } from 'src/app/Models/tasks.view.model';
import { AuthService } from 'src/app/Services/AuthService/auth.service';
import { TasksService } from 'src/app/Services/TaskService/tasks.service';
import { AlertService } from 'src/app/Services/AlertService/alert.service';

@Component({
  selector: 'app-tasks-list',
  templateUrl: './tasks-list.component.html',
  styleUrls: ['./tasks-list.component.css'],
})
export class TasksListComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private router: Router,
    private taskService: TasksService,
    private alertService: AlertService
  ) {}
  ngOnInit(): void {
    this.getTasks();
  }

  //podaci
  taskList: TasksViewModel[] = [];
  taskList1: TasksViewModel[] = [];
  taskList2: TasksViewModel[] = [];
  taskList3: TasksViewModel[] = [];

  taskSub: Subscription = {} as Subscription;
  loading: boolean = true;

  goToTask = (taskId: number) =>
    this.router.navigateByUrl('createTask/' + taskId);

  getTasks() {
    this.taskService.getTasks();
    this.taskSub = this.taskService
      .getTasksUpdated()
      .subscribe((res: TasksViewModel[]) => {
        this.taskList = res;
        this.createFilteredData(this.taskList);
        this.loading = false;
      });
  }

  createSubstrings(model: TasksViewModel) {
    if (model.description.length > 100) {
      model.description = model.description.substr(0, 100);
    }
  }

  createFilteredData(taskList: TasksViewModel[]) {
    taskList.forEach((model) => {
      this.createSubstrings(model);
      switch (model.statusId) {
        case 1:
          this.taskList1.push(model);
          break;
        case 2:
          this.taskList2.push(model);
          break;
        case 3:
          this.taskList3.push(model);
          break;
      }
    });
  }
}
