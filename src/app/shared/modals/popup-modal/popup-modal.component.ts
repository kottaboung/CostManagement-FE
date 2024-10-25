import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-popup-modal',
  templateUrl: './popup-modal.component.html',
  styleUrl: './popup-modal.component.scss'
})
export class PopupModalComponent {

  @Input() headerTitle: string = '';
  @Input() bodyTitle: string = '';
  @Input() description: string = '';
  @Input() okButtonText: string = 'Ok'; // Default text
  @Input() cancelButtonText: string = 'Cancel'; // Default text
  @Input() okButtonColor: 'primary' | 'secondary' | 'success' | 'danger' = 'primary'; // Default color
  @Input() cancelButtonColor: 'primary' | 'secondary' | 'success' | 'danger' = 'secondary'; // Default color
  @Input() headerColor: string = '007bff';
  @Output() okClick = new EventEmitter<void>();
  @Output() cancelClick = new EventEmitter<void>();


  constructor(
    private apiserive: ApiService,
    public activeModal: NgbActiveModal
  ) {

  }

  onOk() {
    this.okClick.emit();
    this.activeModal.close(); // Close the modal when Ok is clicked
  }

  onCancel() {
    this.cancelClick.emit();
    this.activeModal.close(); // Close the modal when Cancel is clicked
  }

  getOkButtonClass(): string {
    return `btn btn-${this.okButtonColor}`; // Bootstrap button class
  }

  getCancelButtonClass(): string {
    return `btn btn-${this.cancelButtonColor}`; // Bootstrap button class
  }

  getHeaderStyle(): { [key: string]: string } {
    return { 'background-color': this.headerColor, 'color': 'white' }; // Dynamic styles for header
  }

}
