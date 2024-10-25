import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { masterDataEmployee } from '../../../core/interface/masterResponse.interface';

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
    public activeModal: NgbActiveModal
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
    if (this.UserForm.valid) {
      const formData = this.UserForm.value;
      
      // Close the modal and pass form data back to the parent component
      this.activeModal.close('saved');
      console.log('User data saved:', formData);
    }
  }

  closeModal(): void {
    this.activeModal.dismiss('Cancel click');  
  }

}
