import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './Components/Auth/login/login.component';
import { RegisterComponent } from './Components/Auth/register/register.component';
import { TasksListComponent } from './Components/Task/tasks-list/tasks-list.component';
import { AuthCheck } from './Services/AuthCheck/auth.check';
import { CreateTaskComponent } from './Components/Task/create-task/create-task.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'createTask/:taskId',
    component: CreateTaskComponent,
    canActivate: [AuthCheck],
  },
  {
    path: 'tasks',
    component: TasksListComponent,
    canActivate: [AuthCheck],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthCheck],
})
export class AppRoutingModule {}
