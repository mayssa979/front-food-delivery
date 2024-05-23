import { Component, OnInit, ViewChild } from '@angular/core';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import { Patient } from 'app/auth/models/patient';
import { PatientService } from 'app/auth/service/patient.service';
import { MDCFormField,MDCFormFieldInput,MDCFormFieldFoundation } from '@material/form-field'
import { FlatpickrOptions } from 'ng2-flatpickr';
import { rdv } from 'app/auth/models/rdv';
import { CalendarService } from 'app/main/apps/calendar/calendar.service';

let event = new rdv();
let randomDateObject = new Date( 1234567891011 );
@Component({
  selector: 'app-new-appointment-sidebar',
  templateUrl: './new-appointment-sidebar.component.html'
})
export class NewAppointmentSidebarComponent implements OnInit {
  @ViewChild('startDatePicker') startDatePicker;
  public fullname;
  public username;
  public email;
  employee: Patient = new Patient();
  submitted = false;
  event: rdv;

  public startDateOptions = {
    altInput: true,
    mode: 'single',
    altInputClass: 'form-control flat-picker flatpickr-input invoice-edit-input',
    enableTime: true
  };

  /**
   * Constructor
   *
   * @param {CoreSidebarService} _coreSidebarService
   */
  constructor(private _coreSidebarService: CoreSidebarService, private patientservice: PatientService) {}
  private _calendarService: CalendarService
  /**
   * Toggle the sidebar
   *
   * @param name
   */
  toggleSidebar(name): void {
    console.log("name ::::",name);
    
    this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
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
      // event.date = this.startDatePicker.flatpickrElement.nativeElement.children[0].toISOString;
      this._calendarService.addEvent(eventForm.form.value);
      //this.toggleEventSidebar();
    }
  }

  ngOnInit(): void {}
}
