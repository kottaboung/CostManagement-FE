import { Component, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../../../../../shared/services/api.service';
import { getmasterEmployee, masterData, masterDataEmployee, masterDataModule, showModuleById } from '../../../../../../../core/interface/masterResponse.interface';
import { ModalService } from '../../../../../../../shared/services/modal.service';
import { title } from 'process';

@Component({
  selector: 'app-module-tasks-detail',
  templateUrl: './module-tasks-detail.component.html',
  styleUrls: ['./module-tasks-detail.component.scss']
})
export class ModuleTasksDetailComponent implements OnInit {
  @Output() projectname: string = '';
  @Output() ifEmployee: masterDataEmployee[] = [];
  projectName: string = '';
  public row: masterDataModule[] = [];
  public columns: any[] = [
    { title: 'Module Name', prop: 'ModuleName', sortable: true, width: 150 },
    { title: 'Created Date', prop: 'ModuleAddDate', sortable: true, width: 150 },
    { title: 'Due Date', prop: 'ModuleDueDate', sortable: true, width: 150 },
    { title: 'Duration', prop: 'mandays', sortable: true, width: 100 },
    { title: "Current", prop: "Current", sortable: true, width: 100 },
    { title: 'button', prop: 'detail', sortable: false, width: 50 }
  ];

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private modalService: ModalService
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.projectName = params['project'];
      this.loadModule();
    });
  }

  fetchAvailableEmployees(): Promise<masterDataEmployee[]> {
    const requestBody = { ProjectName: this.projectName };
    console.log("log:", this.projectName);
  
    return new Promise((resolve, reject) => {
      this.apiService.postApi<getmasterEmployee, { ProjectName: string }>('GetEmployeeInProject', requestBody).subscribe({
        next: res => {
          console.log("Employee project response:", res); // Log the entire response
  
          // Use 'employees' (lowercase 'e') based on the response structure
          if (res.data && res.data.employees) { 
            // Map the employees to the expected type if necessary
            this.ifEmployee = res.data.employees.map(emp => ({
              ...emp,
            }));
            resolve(this.ifEmployee);
          } else {
            console.error('Invalid data structure in response:', res);
            reject(new Error('Invalid data structure'));
          }
        },
        error: error => {
          console.error('Error fetching employees:', error);
          reject(error); 
        }
      });
    });
  }  
  

  loadModule(): void {
    const requestBody = { ProjectName: this.projectName };

    console.log("module project :", this.projectName);

    this.apiService.postApi<showModuleById, { ProjectName: string }>('GetModuleById', requestBody).subscribe({
      next: res => {
        console.log('API Response:', res);
        this.projectname = res.data.project.ProjectName;
        if (res.data && res.data.modules) {
          this.row = res.data.modules.map(module => ({
            ...module,
            ModuleName: module.ModuleName,
            mandays: this.calculateManDays(new Date(module.ModuleAddDate), new Date(module.ModuleDueDate)),
            Current: this.calculateCurrentDays(new Date(), new Date(module.ModuleDueDate))
          }));
        } else {
          console.error('Invalid data format received from the API:', res.data);
        }
      },
      error: error => {
        console.error('An error occurred while fetching module details:', error);
      }
    });
  }

  calculateManDays(startDate: Date, endDate: Date): number {
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  calculateCurrentDays(today: Date, endDate: Date): number {
    const diffTime = endDate.getTime() - today.getTime();
    const remainingDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return remainingDays < 0 ? 0 : remainingDays;
  }

  Createmodule(): void {
    this.fetchAvailableEmployees()
      .then((employees: masterDataEmployee[]) => {
        console.log("Employees fetched successfully:", employees);
  
        if (employees && employees.length > 0) {
          // Pass the employees array to the modal
          const modalRef = this.modalService.createModal(employees); 
          modalRef.result.then((result) => {
            console.log('Modal closed with result:', result);
          }).catch((error) => {
            console.error('Modal dismissed with error:', error);
          });
        } else {
          console.log('No employees available to display in the modal.');
        }
      })
      .catch(error => {
        console.error('Failed to fetch employees:', error);
      });
  }
  
  

  onDetailClick(modules: masterDataModule | masterData ): void {
    if (modules) {
      const Projectname = this.projectName || ""; 
      const modalRef = this.modalService.openModal(modules as masterDataModule, Projectname); 
      modalRef.result.then((result) => {
        console.log('Modal closed with result:', result);
      }).catch((error) => {
        console.error('Modal dismissed with error:', error);
      });
    }
  }
}
