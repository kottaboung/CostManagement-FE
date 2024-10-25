import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../services/api.service';
import { masterDataEmployee, masterDataModule } from '../../../core/interface/masterResponse.interface';
import { ModalService } from '../../services/modal.service';
import { PopupModalComponent } from '../popup-modal/popup-modal.component';

@Component({
  selector: 'app-module-modal',
  templateUrl: './module-modal.component.html',
  styleUrls: ['./module-modal.component.scss']
})
export class ModuleModalComponent implements OnInit {
  @Input() moduleData?: masterDataModule;
  @Input() totalEmployee?: masterDataEmployee[];
  @Input() Projectname: string = '';

  moduleForm!: FormGroup; 
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    public activeModal: NgbActiveModal,
    private modalService: ModalService
  ) {}

  ngOnInit(): void {
    this.isEditMode = !!this.moduleData;  // Determine edit mode
    this.initializeForm();

    if (this.isEditMode && this.moduleData) {
      this.moduleForm.patchValue(this.moduleData);  // Pre-fill form for editing
      this.moduleForm.get('ModuleAddDate')?.disable();
      this.setEmployees(this.moduleData.Employees);  // Populate employee list
    }
    else if(!this.isEditMode && this.totalEmployee) {
      this.setEmployees(this.totalEmployee);
    }
  }

  initializeForm(): void {
    this.moduleForm = this.fb.group({
      ModuleName: ['', Validators.required],
      ModuleAddDate: ['', Validators.required],
      ModuleDueDate: ['', Validators.required],
      Employees: this.fb.array([]) 
    });
  }

  get employees(): FormArray {
    return this.moduleForm.get('Employees') as FormArray; 
  }

  setEmployees(employees: any[]): void {
    const employeeFormArray = this.moduleForm.get('Employees') as FormArray;
    employeeFormArray.clear(); 
    if (employees) {
      employees.forEach(employee => {
        employeeFormArray.push(this.createEmployeeFormGroup(employee));
      });
    }
  }

  createEmployeeFormGroup(employee?: masterDataEmployee): FormGroup {
    return this.fb.group({
      EmployeeId: [employee ? employee.EmployeeId : null],
      EmployeeName: [employee ? employee.EmployeeName : '', Validators.required],
      EmployeePosition: [employee ? employee.EmployeePosition : '', Validators.required],
      EmployeeCost: [employee ? employee.EmployeeCost : 0, [Validators.required, Validators.min(0)]],
      InModule: [employee ? employee.InModule === 1 : false] // Checkbox state based on InModule
    });
  }

  onSubmit(): void {
    if (this.moduleForm.valid && this.isAtLeastOneEmployeeSelected()) {
      const modalRef = this.modalService.popup(PopupModalComponent);
      if(!this.isEditMode) {
        modalRef.componentInstance.headerTitle = 'Confirmation';
        modalRef.componentInstance.bodyTitle = 'Confirm Add New Module?';
        modalRef.componentInstance.description = 'Confirmation to add new module';
        modalRef.componentInstance.okButtonText = 'Yes';
        modalRef.componentInstance.cancelButtonText = 'No';
        modalRef.componentInstance.okButtonColor = 'success';
        modalRef.componentInstance.cancelButtonColor = 'danger';
        modalRef.componentInstance.headerColor = '#32993C';
      }
      else if (this.isEditMode) {
        modalRef.componentInstance.headerTitle = 'Confirmation';
        modalRef.componentInstance.bodyTitle = 'Confirm Edit Module?';
        modalRef.componentInstance.description = 'Confirmation to edit current module';
        modalRef.componentInstance.okButtonText = 'Yes';
        modalRef.componentInstance.cancelButtonText = 'No';
        modalRef.componentInstance.okButtonColor = 'success';
        modalRef.componentInstance.cancelButtonColor = 'danger';
        modalRef.componentInstance.headerColor = '#32993C';
      }
    
      modalRef.result.then((result) => {
        if (result === 'ok') {
          // If confirmed, proceed with saving
          const updatedModule = this.moduleForm.value;
          console.log('Updated Module:', updatedModule);
          this.activeModal.close(updatedModule); 
          this.activeModal.close('saved');
        }
      }).catch(() => {
        // Handle cancel action
        console.log('Confirmation modal dismissed');
      });
    }
  } 
  

  isAtLeastOneEmployeeSelected(): boolean {
    return this.employees.controls.some(employee => employee.get('InModule')?.value);
  }

  closeModal(): void {
    this.activeModal.dismiss('Cancel click');
  }
}
