import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatDialogModule } from '@angular/material/dialog';

import { HomeComponent } from './home.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ProjectsComponent } from './pages/projects/projects.component';
import { UserComponent } from './pages/user/user.component';
import { ChartDetailComponent } from './modals/chart-detail/chart-detail.component';
import { ProjectDetailComponent } from './pages/projects/project-detail/project-detail.component';
import { ModuleTasksDetailComponent } from './pages/projects/project-detail/pages/module-tasks-detail/module-tasks-detail.component';
import { EmployeesComponent } from './pages/projects/project-detail/pages/employees/employees.component';
import { SharedModule } from '../../shared/shared.module';
import { HomeRoutingModule } from './home-routing,module';
import { ManageUserComponent } from './pages/projects/project-detail/pages/manage-user/manage-user.component';


@NgModule({
  declarations: [
    HomeComponent,
    DashboardComponent,
    ProjectsComponent,
    UserComponent,
    ChartDetailComponent,
    ProjectDetailComponent,
    ModuleTasksDetailComponent,
    EmployeesComponent,
    ManageUserComponent,
  ],
  imports: [
  CommonModule,
    ReactiveFormsModule,
    FormsModule,
    HomeRoutingModule,
    SharedModule,
    NgbModule,
    MatDialogModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HomeModule {}
