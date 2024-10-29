import { Component, Input, OnInit, Output } from '@angular/core';
import { Projects } from '../../mockup-interface';
import { LoadingService } from '../../../../shared/services/loading.service';
import { HttpClient } from '@angular/common/http';
import { calculateTotalCost } from '../../mockup-service';
import { ProjectService } from '../../../../shared/services/project.service';
import { MatDialog } from '@angular/material/dialog';
import { ProjectModalComponent } from '../../../../shared/modals/project-modal/project-modal.component';
import { ApiService } from '../../../../shared/services/api.service';
import { ApiResponse } from '../../../../core/interface/response.interface';
import { masterData, masterDataEmployee, masterDataModule } from '../../../../core/interface/masterResponse.interface';
import { ModalService } from '../../../../shared/services/modal.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {
  columns = [
    { title: 'Project Name', prop: 'ProjectName', sortable: true, width: 200 },
    { title: 'Cost', prop: 'ProjectCost' , sortable: true, width: 180 },
    { title: 'Created Date', prop: 'ProjectStart', sortable: true, width: 150 },
    { title: 'End Date', prop: 'ProjectEnd', sortable: true, width: 150 },
    { title: 'Status', prop: 'ProjectStatus', sortable: false, width: 100 },
    { title: 'Detail', prop: 'detail', sortable: false, width: 50 }
  ];
  
  rows: masterData[] = []; // Updated to hold masterData type
  @Output() currentStep: number = 1;
  Project: masterData | null = null;
  master: masterData[] = [];

  constructor(
    private loading: LoadingService, 
    private apiService: ApiService,
    private modalService: ModalService
  ) {}

  onCreate(): void {
    const modalRef = this.modalService.createProject(); 
    modalRef.result.then((result) => {
      console.log('Modal closed with result:', result);
    }).catch((error) => {
      console.error('Modal dismissed with error:', error);
    });
  }
  

  ngOnInit(): void {
    this.loading.showLoading();
    this.loadProj(); // Load projects
  }

  loadProj(): void {
    this.apiService.getApi<masterData[]>('GetAllProjects').subscribe({
      next: (res: ApiResponse<masterData[]>) => {
        if (res.status === 'success') {
          this.rows = res.data.map((project) => {
            return project;
          });
          this.loading.hideLoading();
        } else {
          console.error(res.message);
          this.loading.hideLoading();
        }
      },
      error: (error) => {
        console.error('An error occurred:', error);
        this.loading.hideLoading();
      },
    });
  }

  // onDetailClick(project: masterData): void {
  //   console.log(this.currentStep);
    
  //   if (project.ProjectName) {
  //     this.Project = project;
  //     this.currentStep = 2; 
  //   } else {
  //     console.error('Project or project name is undefined');
  //   }
  // }

  onDetailClick(project: masterData | masterDataModule | masterDataEmployee): void {
    console.log(this.currentStep);

    if ((project as masterData).ProjectName !== undefined) {
      const projects = project as masterData;
      this.Project = projects;
      this.currentStep = 2; 
    } else {
      console.error('Event does not match expected types');
    }
  }


  onBackToProjects(): void {
    this.Project = null;
    this.currentStep = 1; 
  }
}
