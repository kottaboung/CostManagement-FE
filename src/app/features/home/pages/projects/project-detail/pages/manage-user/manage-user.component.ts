import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { masterDataEmployee } from '../../../../../../../core/interface/masterResponse.interface';
import { ModalService } from '../../../../../../../shared/services/modal.service';
import { PopupModalComponent } from '../../../../../../../shared/modals/popup-modal/popup-modal.component';

@Component({
  selector: 'app-manage-user',
  templateUrl: './manage-user.component.html',
  styleUrl: './manage-user.component.scss'
})
export class ManageUserComponent implements OnInit {

  projectName: string = '';
  selectedEmployeeId: number | null = null;

  selecting: masterDataEmployee[] =[
    {
      EmployeeId: 1, EmployeeName: 'John Doe', EmployeePosition: 'Developer', EmployeeCost: 5000
    },
    {
      EmployeeId: 2, EmployeeName: 'John Doe', EmployeePosition: 'Developer', EmployeeCost: 5000
    },
    {
      EmployeeId: 3, EmployeeName: 'John Doe', EmployeePosition: 'Developer', EmployeeCost: 5000
    },
  ]

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
    private modalService: ModalService
  ) {

  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.projectName = params['project'];
      console.log('projectname:', this.projectName);
    });
  }

  openDropDown(card: { employee: masterDataEmployee, isDropDown: boolean }): void {
    card.isDropDown = !card.isDropDown; // Toggle the dropdown for the specific card
  }

  addEmployee(): void {
    if (this.selectedEmployeeId !== null) {
      const selectedEmployee = this.selecting.find(emp => emp.EmployeeId === this.selectedEmployeeId);
      console.log('Selected Employee:', selectedEmployee);
      const modalRef = this.modalService.popup(PopupModalComponent, {
        bodyTitle: "Are you sure to add user to project ?",
        description: "adding user to project",
        okButtonText: "Yes",
        cancelButtonText: "cancel",
        okButtonColor: "success",
        cancaelButtonColor: "secondary"
      })

      modalRef.result.then((result) => {
        if (result === 'ok') {
          
        }
      }).catch(() => {
        // Handle cancel action
        console.log('Confirmation modal dismissed');
      });
    }
  }

}
