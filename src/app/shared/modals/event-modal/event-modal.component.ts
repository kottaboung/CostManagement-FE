import { Component, Input, OnInit } from '@angular/core';
import { ModalService } from '../../services/modal.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { masterDataEvents } from '../../../core/interface/masterResponse.interface';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-event-modal',
  templateUrl: './event-modal.component.html',
  styleUrl: './event-modal.component.scss'
})
export class EventModalComponent implements OnInit {

  @Input() event?: masterDataEvents
  isEditMode: boolean = false;
  eventForm!: FormGroup

  constructor(
    private modalService: ModalService,
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
  ) {

  }

  ngOnInit(): void {
    this.isEditMode = !!this.event
    this.initializeForm();
    
      if(event != null) {
        this.eventForm.patchValue({
          EventTitle: this.event?.EventTitle,
          EventDescription: this.event?.EventDescription,
          EventStart: this.event?.EventStart,
          EventEnd: this.event?.EventEnd,
        })
      }
  }

  initializeForm(): void{
    this.eventForm = this.fb.group({
      EventTitle: ['', Validators.required],
      EventDescription: ['', Validators.required],
      EventStart: ['', Validators.required],
      EventEnd: ['', Validators.required],
      Employees: this.fb.array([]) 
    })
  }

  get employees(): FormArray {
    return this.eventForm.get('Employees') as FormArray; 
  }

  setEmployees(employees: any[]): void {
    const employeeFormArray = this.eventForm.get('Employees') as FormArray;
    employeeFormArray.clear(); 
    if (employees) {
      employees.forEach(employee => {
        //employeeFormArray.push(this.createEmployeeFormGroup(employee));
      });
    }
  }

  onSubmit() {

  }

  closeModal(): void {
    this.activeModal.dismiss('Cancel click');
  }
}
