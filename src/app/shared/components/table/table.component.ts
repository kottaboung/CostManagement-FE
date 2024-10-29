import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Module, Projects, Employee } from '../../../features/home/mockup-interface';
import { mock } from '../../../core/type/mockData';
import { catchError, map, Observable, of } from 'rxjs';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { ApiService } from '../../services/api.service';
import { rModule, rProjects } from '../../../core/interface/dataresponse.interface';
import { ApiResponse } from '../../../core/interface/response.interface';
import { masterData, masterDataEmployee, masterDataModule } from '../../../core/interface/masterResponse.interface';
import { ModalService } from '../../services/modal.service';
import { ModuleModalComponent } from '../../modals/module-modal/module-modal.component';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit, AfterViewInit {

  @Input() rows: any[] = [];
  @Input() columns: any[] = [];
  @Input() dataTable: 'projects' | 'modules' | 'employees' = 'projects';
  @Input() projectName?: string;
  @Input() name?: string
  @Output() ModuleName? : string;
  @Output() dataClick: EventEmitter<masterDataModule> = new EventEmitter<masterDataModule>();
  @Output() detailClick: EventEmitter<masterData | masterDataModule> = new EventEmitter<masterData | masterDataModule>();
  //@ViewChild(DatatableComponent) table: DatatableComponent;

  constructor(private router: Router, private http: HttpClient, 
    private cdr: ChangeDetectorRef, private apiservice: ApiService,
    private modalService: ModalService) { }

  ngAfterViewInit(): void {
      this.cdr.detectChanges();
      //this.table.recalculate();
  }


  ngOnInit(): void {
    if (this.dataTable === 'projects') {
      this.getProjectsFromApi(); 
    } else if (this.projectName && this.dataTable === 'modules') {
      console.warn('projectName is required for modules or employees data!');
    }
  }

  current(value: number): string {
    if(value === 0) {
      return 'Done'
    }
    else {
      return value.toString();
    }
  }


  status(value: number): string {
    return value === 1 ? 'Go A Live' : 'Working';
  }  
  
  getProjectsFromApi(): void {
    this.apiservice.getApi<masterData[]>('GetAllProjects').subscribe({
      next: (res: ApiResponse<masterData[]>) => {
        if (res.status === 'success') {
          // Assuming res.data contains an array of projects
          this.rows = res.data.map(p => {
            // Process the project details
            const projectDetails = {
              ...p,
              ProjectStart: new Date(p.ProjectStart),
              ProjectEnd: new Date(p.ProjectEnd),
              //cost: this.calTotalCost(p),
            };
  
            // Map modules within the project
            const modules = p.Modules.map(m => ({
              ...m,
              ModuleAddDate: new Date(m.ModuleAddDate),
              ModuleDueDate: new Date(m.ModuleDueDate),
            }));
  
            // Return combined project details and modules
            return {
              ...projectDetails,
              modules, // Add modules to the project
            };
          });
  
          console.log('Loaded real projects with modules:', this.rows);
        } else {
          console.error(res.message);
        }
      },
      error: (error) => {
        console.error('An error occurred while fetching projects:', error);
      }
    });
  }

  getModuleFromApi(): Promise<string> {
    return new Promise((resolve, reject) => {
        if (!this.projectName) {
            console.error('ProjectName is undefined');
            reject('ProjectName is undefined');
            return;
        }

        const requestBody = {
            ProjectName: this.projectName
        };

        this.apiservice.postApi<masterDataModule[], { ProjectName: string }>('GetModuleById', requestBody)
            .subscribe({
                next: (res: ApiResponse<masterDataModule[]>) => {
                    if (res.status === 'success') {
                        const modules = res.data.map(m => ({
                            ...m,
                            ModuleAddDate: new Date(m.ModuleAddDate),
                            ModuleDueDate: new Date(m.ModuleDueDate),
                        }));
                        console.log('Loaded real modules:', modules);

                        // Resolve the promise with the project name
                        resolve(this.name ?? "");
                    } else {
                        console.error(res.message);
                        reject(res.message);
                    }
                },
                error: (error) => {
                    console.error('Error fetching modules:', error);
                    reject(error);
                }
            });
    });
}


  findmanday(module: rModule): number {
    const start = new Date(module.ModuleAddDate);
    const due = new Date(module.ModuleDueDate);
    const diffTime = Math.abs(due.getTime() - start.getTime());
    const mandays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return mandays;
  }

  onDetailClick(row: masterData | masterDataModule): void {
    if((row as masterData).ProjectName) {
      this.projectName = (row as masterData).ProjectName;
      this.router.navigate([`/projects/${this.projectName}`]);
    }else {
      this.detailClick.emit(row);
    }
  }

  ondata(row: masterDataModule): void{
    this.dataClick.emit(row);
  }

  // onDetailClick(row: masterData | masterDataModule): void {
  //   let Projectname = this.name ?? ""; // Use `this.name` instead of `this.projectName`

  //   // Check if it's a masterData row with ProjectName
  //   if ((row as masterData).ProjectName) {
  //     Projectname = (row as masterData).ProjectName;
  //     this.router.navigate([`/projects/${Projectname}`]);
  //   }

  //   // If it's a masterDataModule row with ModuleName
  //   if ((row as masterDataModule).ModuleName) {
  //     const moduleData = row as masterDataModule;

  //     // If ProjectName is not set, try to get it from the row
  //     if (!Projectname) {
  //       Projectname = this.projectName || ""; // Use projectName from @Input()
  //     }

  //     const modalRef = this.modalService.openModal(moduleData, Projectname);
  //     modalRef.componentInstance.ProjectName = Projectname;
  //     modalRef.componentInstance.ModuleName = moduleData.ModuleName;

  //     console.log('Module Data:', moduleData);
  //     console.log('Project Name:', Projectname ?? "");
  //   } else {
  //     console.error('Modal could not be opened.');
  //   }
  // }


}
