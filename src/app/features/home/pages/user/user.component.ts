import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { masterDataEmployee } from '../../../../core/interface/masterResponse.interface';
import { ModalService } from '../../../../shared/services/modal.service';
import { PopupModalComponent } from '../../../../shared/modals/popup-modal/popup-modal.component';


@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent {

  @Input() User: masterDataEmployee | null = null;
  constructor(
    private router: Router,
    private modalservice: ModalService
  ){

  }

  cards: masterDataEmployee[] = [
    {
      EmployeeId:1 ,EmployeeName: 'name', EmployeePosition: 'dev', EmployeeCost: 0, EmployeeImage: "/src/assets/icons/User.svg"
    },
    {
      EmployeeId:1 ,EmployeeName: 'name', EmployeePosition: 'dev', EmployeeCost: 0, EmployeeImage: "/src/assets/icons/User.svg"
    },
    {
      EmployeeId:1 ,EmployeeName: 'name', EmployeePosition: 'dev', EmployeeCost: 0, EmployeeImage: "/src/assets/icons/User.svg"
    },
    {
      EmployeeId:1 ,EmployeeName: 'name', EmployeePosition: 'dev', EmployeeCost: 0, EmployeeImage: "/src/assets/icons/User.svg"
    },
    {
      EmployeeId:1 ,EmployeeName: 'name', EmployeePosition: 'dev', EmployeeCost: 0, EmployeeImage: "/src/assets/icons/User.svg"
    },
    {
      EmployeeId:1 ,EmployeeName: 'name', EmployeePosition: 'dev', EmployeeCost: 0, EmployeeImage: "/src/assets/icons/User.svg"
    },
  ];

  createNew(card?: masterDataEmployee): void {
    const modalRef = this.modalservice.onUser(card);

    modalRef.result.then((result) => {
      if (result === 'saved') {
        // Handle the success case when user data is saved
        console.log('User data saved successfully.');
      }
    }).catch((error) => {
      console.log('Modal dismissed:', error);
    });
  }

  openPopup() {
    const modalRef = this.modalservice.popup(PopupModalComponent, {
      headerTitle: 'Confirmation',
      bodyTitle: 'Delete User ',
      description: 'Are you sure to Delete User ?',
      okButtonText: 'Yes', // Custom text for Ok button
      cancelButtonText: 'No', // Custom text for Cancel button
      okButtonColor: 'danger', // Custom color for Ok button (green)
      cancelButtonColor: 'secondary', // Custom color for Cancel button (red)
      headerColor: '#CE2222FF'
    });

    modalRef.componentInstance.okClick.subscribe(() => {
      console.log('Ok clicked');
      // Handle Ok action here
    });

    modalRef.componentInstance.cancelClick.subscribe(() => {
      console.log('Cancel clicked');
      // Handle Cancel action here
    });
  }

  OnSetting() {
    this.router.navigate(['about/setting'])
  }

}
