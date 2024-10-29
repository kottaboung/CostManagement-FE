import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { CalendarOptions, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PopupModalComponent } from '../../modals/popup-modal/popup-modal.component';
import { ModalService } from './../../services/modal.service';
import { ApiService } from '../../services/api.service';
import { masterDataEmployee, masterDataEvents } from '../../../core/interface/masterResponse.interface';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { ApiResponse } from '../../../core/interface/response.interface';

@Component({
  selector: 'app-callendar',
  templateUrl: './callendar.component.html',
  styleUrls: ['./callendar.component.scss']
})
export class CallendarComponent implements OnInit {

  @Input() projectName: string = '';
  @Input() employees: masterDataEmployee[] = [];
  Events: masterDataEvents[] = [];
  employeeEvents: { [key: number]: EventInput[] } = {};
  selectedEventId: string | null = null;
  eventForm: FormGroup;
  editMode: boolean = false;

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
    eventClick: this.onEdit.bind(this),
  };

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private modalService: ModalService,
    private apiService: ApiService
  ) {
    this.eventForm = this.fb.group({
      title: ['', Validators.required],
      start: ['', Validators.required],
      end: ['', Validators.required],
      descript: [''],
    });
  }

  ngOnInit(): void {
    if (this.projectName) {
      this.getEvent();
    }
  }

  getEvent() {
    const reqBody = { ProjectName: this.projectName };

    this.apiService.postApi<masterDataEvents[], { ProjectName: string }>('/GetEventInProject', reqBody)
      .subscribe({
        next: (res: ApiResponse<masterDataEvents[]>) => {
          if (res.data) {
            this.Events = res.data;
            this.loadEventsToCalendar();
            this.assignEventsToEmployees();
          }
        },
        error: (error) => {
          console.error('Error fetching events:', error);
        }
      });
  }

  loadEventsToCalendar() {
    const calendarEvents = this.Events.map(event => ({
      id: event.EventId.toString(), // Convert ID to string for FullCalendar
      title: event.EventTitle,
      start: event.EventStart,
      end: event.EventEnd,
      extendedProps: {
        descript: event.EventDescription,
        employees: event.Employees
      }
    }));

    this.calendarOptions.events = calendarEvents;
    this.calendarComponent.getApi().addEventSource(calendarEvents);
  }

  assignEventsToEmployees() {
    this.employees.forEach(employee => {
      this.employeeEvents[employee.EmployeeId] = this.Events.filter(event => 
        event.Employees?.some(emp => emp.EmployeeId === employee.EmployeeId)
      );
    });
  }

  onEdit(arg: any): void {
    this.selectedEventId = arg.event.id;
    const selectedEvent = this.Events.find(event => event.EventId.toString() === this.selectedEventId);

    if (selectedEvent) {
      this.editMode = true;
      this.eventForm.patchValue({
        title: selectedEvent.EventTitle,
        start: selectedEvent.EventStart,
        end: selectedEvent.EventEnd,
        descript: selectedEvent.EventDescription,
      });

      const modalRef = this.modalService.openEvent(selectedEvent);
      modalRef.componentInstance.eventForm = this.eventForm;
      modalRef.componentInstance.saveEvent.subscribe(() => {
        this.saveEvent();
      });
    }
  }

  openModal() {

  }

  saveEvent(): void {
    const eventData = this.eventForm.value;
    const calendarApi = this.calendarComponent.getApi();

    if (this.editMode && this.selectedEventId) {
      const event = calendarApi.getEventById(this.selectedEventId);
      if (event) {
        event.setProp('title', eventData.title);
        event.setDates(eventData.start, eventData.end);
        event.setExtendedProp('descript', eventData.descript);
      }
    } else {
      const newEvent: EventInput = {
        title: eventData.title,
        start: eventData.start,
        end: eventData.end,
        extendedProps: {
          descript: eventData.descript,
        },
      };

      const modalRef = this.modalService.openEvent(eventData);
      modalRef.componentInstance.okClick.subscribe(() => {
        this.calendarComponent.getApi().addEvent(newEvent);
        console.log('New Event Added:', newEvent);
      });

      modalRef.componentInstance.cancelClick.subscribe(() => {
        console.log('Cancelled event creation');
      });
    }
  }

}
