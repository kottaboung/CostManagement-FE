import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { addedUser, masterDataEmployee } from '../../../../../../../core/interface/masterResponse.interface';
import { ModalService } from '../../../../../../../shared/services/modal.service';
import { PopupModalComponent } from '../../../../../../../shared/modals/popup-modal/popup-modal.component';
import { ApiService } from '../../../../../../../shared/services/api.service';
import { ApiResponse } from '../../../../../../../core/interface/response.interface';
import { Employee } from './../../../../../mockup-interface';
import { error } from 'console';

@Component({
  selector: 'app-manage-user',
  templateUrl: './manage-user.component.html',
  styleUrl: './manage-user.component.scss'
})
export class ManageUserComponent implements OnInit {

  projectName: string = '';
  selectedEmployeeId: number | null = null;

  selecting: masterDataEmployee[] =[]

  cards: { employee: masterDataEmployee, isDropDown: boolean }[] = [
    {
      employee: { EmployeeId: 1, EmployeeName: 'John Doe', EmployeePosition: 'Developer', EmployeeCost: 5000 },
      isDropDown: false
    },
    {
      employee: { EmployeeId: 2, EmployeeName: 'Jane Smith', EmployeePosition: 'Designer', EmployeeCost: 4500 },
      isDropDown: false
    },
    {
      employee: { EmployeeId: 3, EmployeeName: 'Alice Johnson', EmployeePosition: 'Manager', EmployeeCost: 6000 },
      isDropDown: false
    },
    // Add more employee cards as needed
  ];

  constructor(
    private route: ActivatedRoute,
    private modalService: ModalService,
    private apiService: ApiService
  ) {

  }

  ngOnInit(): void {
    this.showUser();
    this.route.queryParams.subscribe(params => {
      this.projectName = params['project'];
      console.log('projectname:', this.projectName);
    });
    
  }

  showUser(): void {
    this.apiService.getApi<masterDataEmployee[]>('GetAllEmployees').subscribe({
      next: (res: ApiResponse<masterDataEmployee[]>) => {
        if(res.data) {
          this.selecting = res.data
        }
        console.log('selecting : ', this.selecting );
      }
    });
  }
  
  openDropDown(card: { employee: masterDataEmployee, isDropDown: boolean }): void {
    card.isDropDown = !card.isDropDown; // Toggle the dropdown for the specific card
  }

  addEmployee(): void {
    
    // Ensure an employee is selected
    if (this.selectedEmployeeId !== null) {
      console.log('Selected Employee ID:', this.selectedEmployeeId);
      const selectedEmployee = this.selecting.find(emp => emp.EmployeeId === this.selectedEmployeeId);
      console.log('selecting:',selectedEmployee)
      const name = selectedEmployee?.EmployeeName || ""
      console.log('Selected Employee:', name);
  
      // Check if the selected employee exists in the list
      if (!selectedEmployee) {
        console.error('Selected employee not found.');
        return;
      }
  
      // Open confirmation modal
      const modalRef = this.modalService.popup(PopupModalComponent, {
        bodyTitle: "Are you sure you want to add this user to the project?",
        description: "This action will add the selected user to the project.",
        okButtonText: "Yes",
        cancelButtonText: "Cancel",
        okButtonColor: "success",
        cancelButtonColor: "secondary"
      });
  
      modalRef.result.then((result) => {
        if (result === 'ok') {
          this.addUserToProject(name); // Call the function to add the employee
        }
      }).catch(() => {
        console.log('Confirmation modal dismissed');
      });
    } else {
      console.error("No employee selected.");
    }
  }
  
  // Separate function for adding user to the project
  addUserToProject(name: string): void {
    const requestBody = {
      EmployeeName: name,
      ProjectName: this.projectName
    };
  
    this.apiService.postApi<addedUser, { EmployeeName: string, ProjectName: string }>('InjectEmployeeToProject', requestBody).subscribe({
      next: (res: ApiResponse<addedUser>) => {
        if (res.data) {
          console.log(res.data);
        }
      }
    })
  }

  onDelete(): void{
    const modalRef = this.modalService.popup(PopupModalComponent, {
      bodyTitle: "Delete User",
      description: "Delete User",
      okButtonText: "Yes",
      cancelButtonText: "Cancel",
      okButtonColor: "success",
      cancelButtonColor: "danger",
      headerColor: "#CE2222"
    }); 
  }
  

}
