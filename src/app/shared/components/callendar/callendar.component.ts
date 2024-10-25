import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { CalendarOptions, DateInput, EventInput } from '@fullcalendar/core/index.js';
import dayGridPlugin from '@fullcalendar/daygrid'; // import dayGridPlugin
import timeGridPlugin from '@fullcalendar/timegrid'; // import timeGridPlugin
import listPlugin from '@fullcalendar/list'; // import listPlugin
import interactionPlugin from '@fullcalendar/interaction'
import { Employee, Projects } from '../../../features/home/mockup-interface';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { masterDataEmployee } from '../../../core/interface/masterResponse.interface';
import { PopupModalComponent } from '../../modals/popup-modal/popup-modal.component';
import { ModalService } from './../../services/modal.service';

declare var bootstrap: any;
@Component({
  selector: 'app-callendar',
  templateUrl: './callendar.component.html',
  styleUrl: './callendar.component.scss'
})
export class CallendarComponent implements OnInit {

  @Input() projectName: string = '';
  @Input() employees: masterDataEmployee[] = [];
  emlist: Employee[]=[];
  filteredEmList: Employee[] = [];
  selectedEvent: any;
  eventForm: FormGroup;
  editMode: boolean = false;
  selectedEventId: string | null = null;

  @ViewChild(FullCalendarComponent) calendarComponent!: FullCalendarComponent;

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin, listPlugin],
    headerToolbar: {
      left: 'prev,next,today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay',
    },
    events: [],
    selectable: true,
    editable: true,
    weekends: true,
    eventClick: this.handleEventClick.bind(this),
  };

  private getRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  private assignRandomColors(): void {
    this.employees.forEach(employee => {
      if (!this.employeeColors[employee.EmployeeId]) {
        this.employeeColors[employee.EmployeeId] = this.getRandomColor();
      }
    });
  }

  employeeEvents: { [key: number]: EventInput[] } = {};
  employeeColors: { [key: number]: string } = {};

  constructor(private http: HttpClient,private fb: FormBuilder, private modalService: ModalService) {
    this.eventForm = this.fb.group({
      title: ['',Validators.required],
      start: ['',Validators.required],
      end: ['',Validators.required],
      Evemployees: this.fb.array([]),
      employees: [''],
      descript: [''],
    });
  }

  ngOnInit(): void {
    this.mockEmployeeList();
    if (this.projectName) {
      this.loadEvents();
      this.assignRandomColors();
    }
  }

  mockEmployeeList(): void {
    this.emlist = [
      { EmployeeId: 1, EmployeeName: 'John Doe' },
      { EmployeeId: 2, EmployeeName: 'Jane Smith' },
      { EmployeeId: 3, EmployeeName: 'Sam Johnson' },
      { EmployeeId: 4, EmployeeName: 'Lisa Wong' }
    ];
    this.updateFilteredEmployeeList();
  }

  private updateFilteredEmployeeList(): void {
    const selectedEmployeeIds = this.Evemployees.controls.map(employee => employee.get('employeeName')?.value);
    
    this.filteredEmList = this.emlist.filter(employee => !selectedEmployeeIds.includes(employee.EmployeeName));
  }

  // addEmployee(employeeSelect: HTMLSelectElement): void {
  //   // const selectedEmployeeId = employeeSelect.value;
  //   // const selectedEmployee = this.employees.find(emp => emp.EmployeeId === +selectedEmployeeId);
  
  //   // if (selectedEmployee) {
  //   //   const employeeGroup = this.fb.group({
  //   //     employeeName: [selectedEmployee.EmployeeName, Validators.required] // Use employee name in the form group
  //   //   });
  
  //   //   this.Evemployees.push(employeeGroup);
  //   //   // Reset the select field after adding the employee
  //   //   employeeSelect.value = '';
  //   // } else {
  //   //   console.warn('Selected employee not found.');
  //   // }

  //   const selectedEmployeeId = employeeSelect.value;
  //   const selectedEmployee = this.emlist.find(emp => emp.EmployeeId === +selectedEmployeeId);

  //   if (selectedEmployee) {
  //     const employeeGroup = this.fb.group({
  //       employeeName: [selectedEmployee.EmployeeName, Validators.required] // Use employee name in the form group
  //     });

  //     this.Evemployees.push(employeeGroup);
  //     this.updateFilteredEmployeeList();
  //     employeeSelect.value = '';
  //   } else {
  //     console.warn('Selected employee not found.');
  //   }
  // }
  

  // Remove employee from the FormArray
  
  addEmployee(employeeSelect: HTMLSelectElement): void {
    const selectedEmployeeId = employeeSelect.value;
    const selectedEmployee = this.emlist.find(emp => emp.EmployeeId === +selectedEmployeeId);

    if (selectedEmployee) {
      const employeeGroup = this.fb.group({
        employeeName: [selectedEmployee.EmployeeName, Validators.required]
      });

      this.Evemployees.push(employeeGroup);

      // Update filtered list after adding an employee
      this.updateFilteredEmployeeList();
      
      // Reset the select field after adding the employee
      employeeSelect.value = '';
    } else {
      console.warn('Selected employee not found.');
    }
  }

  
  removeEmployee(index: number): void {
    this.Evemployees.removeAt(index);
    this.updateFilteredEmployeeList();
  }

  loadEvents(): void {
    this.http.get<Projects[]>('/assets/mockdata/mockData.json').subscribe(data => {
      const project = data.find(p => p.name === this.projectName);
      if (project) {
        const events: EventInput[] = [];
        project.modules.forEach(module => {
          module.mockEvents.forEach(event => {
            events.push({
              title: event.title,
              start: event.date,
              extendedProps: {
                module: module.moduleName,
                descript: event.descript
              },
              id: event.title
            });
  
            if (event.employeeId) {
              if (!this.employeeEvents[event.employeeId]) {
                this.employeeEvents[event.employeeId] = [];
              }
              this.employeeEvents[event.employeeId].push({
                id: event.title,
                title: event.title,
                start: event.date,
                extendedProps: {
                  descript: event.descript
                }
              });
            }
          });
        });
  
        // Refresh calendar with new events
        this.calendarComponent.getApi().removeAllEvents();
        this.calendarComponent.getApi().addEventSource(events);
      } else {
        console.warn('Project not found: ', this.projectName);
      }
    }, error => {
      console.error('Error loading events: ', error);
    });
  }

  openCreateEventOffcanvas(): void {
    this.editMode = false;
    this.selectedEventId = null;

    const today = new Date().toISOString().split('T')[0]; // Get current date in yyyy-mm-dd format

    // Reset the form with default values (start date set to today)
    this.eventForm.reset({
      title: '',
      start: today + 'T09:00', // Default start time at 9 AM
      end: today + 'T17:00',   // Default end time at 5 PM
      descript: ''
    });

    const offcanvasElement = document.getElementById('editEventOffcanvas');
    const offcanvas = new bootstrap.Offcanvas(offcanvasElement!);
    offcanvas.show();
  }
  

  handleEventClick(arg: any): void {
    this.selectedEvent = arg.event;
    this.editMode = true; // Set edit mode to true
    this.selectedEventId = this.selectedEvent.id;
  
    // Populate the form with selected event details
    this.eventForm.patchValue({
      title: this.selectedEvent.title,
      start: this.selectedEvent.startStr,
      end: this.selectedEvent.endStr,
      descript: this.selectedEvent.extendedProps['descript'],
    });
  
    // Open the Bootstrap offcanvas
    const offcanvasElement = document.getElementById('editEventOffcanvas');
    const offcanvas = new bootstrap.Offcanvas(offcanvasElement);
    offcanvas.show();
  }

  get Evemployees(): FormArray {
    return this.eventForm.get('Evemployees') as FormArray;
  }

  saveEvent(): void {
    const eventData = this.eventForm.value;
  
    if (this.editMode && this.selectedEvent) {
      // Edit existing event
      const calendarApi = this.calendarComponent.getApi();
      const event = calendarApi.getEventById(this.selectedEvent.id);
  
      if (event) {
        // Update the event properties
        event.setProp('title', eventData.title);
        event.setDates(eventData.start, eventData.end);
        event.setExtendedProp('descript', eventData.descript);
      }
    } else {
      // Create new event
      const newEvent: EventInput = {
        title: eventData.title,
        start: eventData.start,
        end: eventData.end,
        extendedProps: {
          descript: eventData.descript
        }
      };
  
      const modalRef = this.modalService.popup(PopupModalComponent);
      modalRef.componentInstance.headerTitle = 'Confirmation';
      modalRef.componentInstance.bodyTitle = 'Confirm Add New Event?';
      modalRef.componentInstance.description = 'Confirmation to add new event';
      modalRef.componentInstance.okButtonText = 'Yes';
      modalRef.componentInstance.cancelButtonText = 'No';
      modalRef.componentInstance.okButtonColor = 'success';
      modalRef.componentInstance.cancelButtonColor = 'danger';
      modalRef.componentInstance.headerColor = '#32993C';
  
      modalRef.componentInstance.okClick.subscribe(() => {
        this.calendarComponent.getApi().addEvent(newEvent);
        console.log('Ok clicked');
  
        // Close the offcanvas element with delay
        setTimeout(() => {
          const offcanvasElement = document.getElementById('editEventOffcanvas');
          if (offcanvasElement) {
            const offcanvas = bootstrap.Offcanvas.getInstance(offcanvasElement) || new bootstrap.Offcanvas(offcanvasElement);
            offcanvas.hide();
          } else {
            console.warn('Offcanvas element not found');
          }
        }, 100); // Short delay to ensure smooth closure
      });
  
      modalRef.componentInstance.cancelClick.subscribe(() => {
        console.log('Cancel clicked');
      });
    }
  }

  // saveEvent(): void {
  //   const eventData = this.eventForm.value;
  
  //   if (this.editMode && this.selectedEvent) {
  //     // Edit existing event
  //     const calendarApi = this.calendarComponent.getApi();
  //     const event = calendarApi.getEventById(this.selectedEvent.id);
  
  //     if (event) {
  //       // Update the event properties
  //       event.setProp('title', eventData.title);
  //       event.setDates(eventData.start, eventData.end);
  //       event.setExtendedProp('descript', eventData.descript);
  //     }
  //   } else {
  //     // Create new event
  //     const newEvent: EventInput = {
  //       title: eventData.title,
  //       start: eventData.start,
  //       end: eventData.end,
  //       extendedProps: {
  //         descript: eventData.descript
  //       },
        
  //     };

  //     const modalRef = this.modalService.popup(PopupModalComponent);
  //     modalRef.componentInstance.headerTitle = 'Confirmation';
  //     modalRef.componentInstance.bodyTitle = 'Confirm Add New Event?';
  //     modalRef.componentInstance.description = 'Confirmation to add new event';
  //     modalRef.componentInstance.okButtonText = 'Yes';
  //     modalRef.componentInstance.cancelButtonText = 'No';
  //     modalRef.componentInstance.okButtonColor = 'success';
  //     modalRef.componentInstance.cancelButtonColor = 'danger';
  //     modalRef.componentInstance.headerColor = '#32993C';
    

  //     modalRef.componentInstance.okClick.subscribe(() => {
  //       this.calendarComponent.getApi().addEvent(newEvent);
  //       console.log('Ok clicked');
        
  //       const offcanvasElement = document.getElementById('editEventOffcanvas');
  //       const offcanvas = bootstrap.Offcanvas.getInstance(offcanvasElement!);
  //       offcanvas?.hide();
  //       // Handle Ok action here
  //     });
  
  //     modalRef.componentInstance.cancelClick.subscribe(() => {
  //       console.log('Cancel clicked');
  //       // Handle Cancel action here
  //     });
  //   }
  // }
  

  scrollToEvent(eventId?: string): void {
    if (!eventId) {
      console.warn('Event ID is undefined');
      return;
    }
  
    const calendarApi = this.calendarComponent.getApi();
    const event = calendarApi.getEventById(eventId);
    
    if (event && event.start) {
      // Scroll to the event start date
      const startDate = event.start;
      const dateStr = startDate.toISOString().split('T')[0]; // yyyy-mm-dd
  
      calendarApi.gotoDate(dateStr);
    } else {
      console.warn('Event not found or start date is null');
    }
  }
  
  
}
