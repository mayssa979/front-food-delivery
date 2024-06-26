import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';

import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';

import { EventRef } from 'app/main/apps/calendar/calendar.model';
import { CalendarService } from 'app/main/apps/calendar/calendar.service';
import { rdv } from 'app/auth/models/rdv';

let event = new rdv();

@Component({
  selector: 'app-calendar-event-sidebar',
  templateUrl: './calendar-event-sidebar.component.html',
  encapsulation: ViewEncapsulation.None
})
export class CalendarEventSidebarComponent implements OnInit {
  //  Decorator
  @ViewChild('startDatePicker') startDatePicker;
  @ViewChild('endDatePicker') endDatePicker;

  // Public
  //public rd: rdv ;
  //public event: EventRef;
  public event: rdv;
  public id: number;
  public isDataEmpty;
  public selectLabel = [
    { label: 'Business', bullet: 'primary' },
    { label: 'Personal', bullet: 'danger' },
    { label: 'Family', bullet: 'warning' },
    { label: 'Holiday', bullet: 'success' },
    { label: 'ETC', bullet: 'info' }
  ];
  public selectGuest = [
    { name: 'Jane Foster', avatar: 'assets/images/avatars/1-small.png' },
    { name: 'Donna Frank', avatar: 'assets/images/avatars/3-small.png' },
    { name: 'Gabrielle Robertson', avatar: 'assets/images/avatars/5-small.png' },
    { name: 'Lori Spears', avatar: 'assets/images/avatars/7-small.png' },
    { name: 'Sandy Vega', avatar: 'assets/images/avatars/9-small.png' },
    { name: 'Cheryl May', avatar: 'assets/images/avatars/11-small.png' }
  ];
  public startDateOptions = {
    altInput: true,
    mode: 'single',
    altInputClass: 'form-control flat-picker flatpickr-input invoice-edit-input',
    enableTime: true
  };
  public endDateOptions = {
    altInput: true,
    mode: 'single',
    altInputClass: 'form-control flat-picker flatpickr-input invoice-edit-input',
    enableTime: true
  };

  /**
   *
   * @param {CoreSidebarService} _coreSidebarService
   * @param {CalendarService} _calendarService
   */
  constructor(private _coreSidebarService: CoreSidebarService, private _calendarService: CalendarService) {}

  // Public Methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Toggle Event Sidebar
   */
  toggleEventSidebar() {
    this._coreSidebarService.getSidebarRegistry('calendar-event-sidebar').toggleOpen();
  }

  /**
   * Add Event
   *
   * @param eventForm
   */
  addEvent(eventForm) {
    if (eventForm.valid) {
     // const date: Date = new Date(2018, 0O5, 0O5, 17, 23, 42, 11);  
      //! Fix: Temp fix till ng2-flatpicker support ng-modal (Getting NG0100: Expression has changed after it was checked error if we use ng-model with ng2-flatpicker)
      eventForm.form.value.start = this.startDatePicker.flatpickrElement.nativeElement.children[0].value;
     // eventForm.form.value.end = this.endDatePicker.flatpickrElement.nativeElement.children[0].value;
       // eventForm.form.value.start = date.toISOString();
       event.date = this.startDatePicker.flatpickrElement.nativeElement.children[0].toISOString;
      this._calendarService.addEvent(eventForm.form.value);
      this.toggleEventSidebar();
    }
  }



  /**
   * Update Event
   */
  updateEvent() {
    this.toggleEventSidebar();
    //! Fix: Temp fix till ng2-flatpicker support ng-modal
    //this.event.start = this.startDatePicker.flatpickrElement.nativeElement.children[0].value;
    //this.event.end = this.endDatePicker.flatpickrElement.nativeElement.children[0].value;
    this._calendarService.postUpdatedEvent(this.event);
  }

  /**
   * Delete Event
   */
  deleteEvent() {
    this._calendarService.deleteEvent(this.event);
    this.toggleEventSidebar();
  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    // Subscribe to current event changes
    this._calendarService.onCurrentEventChange.subscribe(response => {
      this.event = response;
      //rd = response;
      // If Event is available
     // console.log("event ---- ", this.event);
      

      console.log(" "+Object.keys(response).length);
      console.log("id "+this.event.id);
      if (Object.keys(response).length > 0) {
        this.event = response;
        //console.log("sidebar ----- " ,this.event.extendedProps.patient);
        //rd = response ;
        this.isDataEmpty = false;
        if (response.id === undefined) {
          this.isDataEmpty = true;
          setTimeout(() => {
            this.startDatePicker.flatpickr.clear();
            //this.startDatePicker.Clear;
           // this.endDatePicker.flatpickr.clear();
          });
        }
      }
      // else Create New Event
      else {
        this.event = new rdv();
        //event = new rdv();
        // Clear Flatpicker Values
       // this.startDatePicker.flatpickr.clear();
        setTimeout(() => {
          this.startDatePicker.flatpickr.clear();
          //this.startDatePicker.Clear;
         // this.endDatePicker.flatpickr.clear();
        });
        this.isDataEmpty = true;
      }
    });
  }
}
