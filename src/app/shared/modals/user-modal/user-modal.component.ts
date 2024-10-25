import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { masterDataEmployee } from '../../../core/interface/masterResponse.interface';
import { PopupModalComponent } from '../popup-modal/popup-modal.component';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-user-modal',
  templateUrl: './user-modal.component.html',
  styleUrl: './user-modal.component.scss'
})
export class UserModalComponent implements OnInit {

  UserForm: FormGroup;
  @Input() User?: masterDataEmployee | null

  public isEditMode = false;

  constructor(
    private fb: FormBuilder,
    private apiserive: ApiService,
    public activeModal: NgbActiveModal,
    private modalService: ModalService
  ) {
    this.UserForm = this.fb.group({
      userName: ['', Validators.required],
      position: ['', Validators.required],
      cost: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    if (this.User) {
      if(this.User == null) {
        this.isEditMode = false;
      }
      this.isEditMode = true;
      this.UserForm.patchValue({
        userName: this.User.EmployeeName,
        position: this.User.EmployeePosition,
        cost: this.User.EmployeeCost,
      });
    }
  }

  onSubmit(): void {
    const modalRef = this.modalService.popup(PopupModalComponent);
    if(!this.isEditMode) {
      modalRef.componentInstance.headerTitle = 'Confirmation';
      modalRef.componentInstance.bodyTitle = 'Confirm Add New User?';
      modalRef.componentInstance.description = 'Confirmation to add new user';
      modalRef.componentInstance.okButtonText = 'Yes';
      modalRef.componentInstance.cancelButtonText = 'No';
      modalRef.componentInstance.okButtonColor = 'success';
      modalRef.componentInstance.cancelButtonColor = 'danger';
      modalRef.componentInstance.headerColor = '#32993C';
    }
    else if (this.isEditMode) {
      modalRef.componentInstance.headerTitle = 'Confirmation';
      modalRef.componentInstance.bodyTitle = 'Confirm Edit User?';
      modalRef.componentInstance.description = 'Confirmation to edit current user';
      modalRef.componentInstance.okButtonText = 'Yes';
      modalRef.componentInstance.cancelButtonText = 'No';
      modalRef.componentInstance.okButtonColor = 'success';
      modalRef.componentInstance.cancelButtonColor = 'danger';
      modalRef.componentInstance.headerColor = '#32993C';
    }
    

    // Handle confirmation result
    modalRef.result.then((result) => {
      if (result === 'ok') {
        // If confirmed, proceed with saving
        this.saveUserData();
        this.activeModal.close('saved');
      }
    }).catch(() => {
      // Handle cancel action
      console.log('Confirmation modal dismissed');
    });
  }

  private saveUserData(): void {
    if (this.UserForm.valid) {
      const formData = this.UserForm.value;
      console.log('User data saved:', formData);
    }
  }

  closeModal(): void {
    this.activeModal.dismiss('Cancel click');  
  }

}
