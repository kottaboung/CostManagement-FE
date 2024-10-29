import { Injectable } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, Subject } from 'rxjs';
import { masterData, masterDataEmployee, masterDataEvents, masterDataModule } from '../../core/interface/masterResponse.interface';
import { ModuleModalComponent } from '../modals/module-modal/module-modal.component';
import { DetailModalComponent } from '../modals/detail-modal/detail-modal.component';
import { ProjectDetail } from '../../core/interface/chartResponse.interface';
import { ProjectDetailComponent } from '../../features/home/pages/projects/project-detail/project-detail.component';
import { ProjectModalComponent } from '../modals/project-modal/project-modal.component';
import { UserModalComponent } from '../modals/user-modal/user-modal.component';
import { PopupModalComponent } from './../modals/popup-modal/popup-modal.component';
import { EventModalComponent } from '../modals/event-modal/event-modal.component';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private modalRef: NgbModalRef | null = null;
  private titleSubject = new Subject<string>();
  private descriptionSubject = new Subject<string>();

  title$ = this.titleSubject.asObservable();
  description$ = this.descriptionSubject.asObservable();

  constructor(private modalService: NgbModal) {}

  popup<T>(PopupModalComponent: new (...args: any[]) => T, inputs: any = {}): NgbModalRef {
    this.modalRef = this.modalService.open(PopupModalComponent, { backdrop: 'static', keyboard: false });

    // Set inputs dynamically on the modal instance
    for (const key in inputs) {
      if (inputs.hasOwnProperty(key)) {
        this.modalRef.componentInstance[key] = inputs[key];
      }
    }

    return this.modalRef;
  }

  openModal(moduleData: masterDataModule | null, projectName: string): NgbModalRef {
    const modalRef = this.modalService.open(ModuleModalComponent);
    
    modalRef.componentInstance.projectName = projectName;
  
    if (moduleData) {
      modalRef.componentInstance.moduleData = moduleData;  // Edit mode
    } else {
      modalRef.componentInstance.moduleData = null;  // Create mode
    }
    
    return modalRef;
  }

  createModal(employees: masterDataEmployee[]): NgbModalRef {
    const modalRef = this.modalService.open(ModuleModalComponent);
  
    // Pass the entire array of employees to the modal component
    modalRef.componentInstance.totalEmployee = employees;
  
    return modalRef;
  }

  createProject(): NgbModalRef {
    return this.modalService.open(ProjectModalComponent, { backdrop: 'static', keyboard: false });
  }

  openDetail(monthDetail: ProjectDetail[], monthName: string): NgbModalRef {
    const modalRef = this.modalService.open(DetailModalComponent);

    modalRef.componentInstance.monthDetail = monthDetail; // Use monthDetail here
    modalRef.componentInstance.monthName = monthName;

    return modalRef;
}

  onUser(User?: masterDataEmployee): NgbModalRef {
    const modalRef = this.modalService.open(UserModalComponent);

    modalRef.componentInstance.User = User ? User : null;
    return modalRef;
  }

  openEvent(event?: masterDataEvents): NgbModalRef {
    const modalRef = this.modalService.open(EventModalComponent);

    modalRef.componentInstance.event = event ? event : null;
    return modalRef;
  }

  closeModal(modalRef: NgbModalRef): void {
    if (modalRef) {
      modalRef.close();
    }
    if (this.modalRef) {
      this.modalRef.close();
      this.modalRef = null;
    }
  }
}
