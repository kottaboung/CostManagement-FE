import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ProjectsComponent } from './pages/projects/projects.component';
import { ProjectDetailComponent } from './pages/projects/project-detail/project-detail.component';
import { UserComponent } from './pages/user/user.component';
import { ModuleTasksDetailComponent } from './pages/projects/project-detail/pages/module-tasks-detail/module-tasks-detail.component';
import { EmployeesComponent } from './pages/projects/project-detail/pages/employees/employees.component';
import { ManageUserComponent } from './pages/projects/project-detail/pages/manage-user/manage-user.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
      {
        path: 'projects',
        component: ProjectsComponent,
      },
      {
        path: 'projects/:name',
        component: ProjectDetailComponent,
        children:[
          {
            path: 'module-tasks',
            component: ModuleTasksDetailComponent
          },
          {
            path: 'employees',
            component: EmployeesComponent
          },
          {
            path: 'manage',
            component: ManageUserComponent
          }
          // {
          //   path: '',
          //   redirectTo: 'module-tasks',
          //   pathMatch: 'full'
          // }
        ]
      },
      {
        path: 'user',
        component: UserComponent,
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
