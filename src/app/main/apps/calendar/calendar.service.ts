import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';

import { BehaviorSubject, Observable } from 'rxjs';

import { EventRef } from 'app/main/apps/calendar/calendar.model';

import { rdv } from 'app/auth/models/rdv';
import { TokenStorageService } from 'app/main/pages/authentication/auth-login-v2/TokenStorageService';
import { User } from 'app/auth/models/user';

let rd = new rdv();

@Injectable()
export class CalendarService implements Resolve<any> {
  model: any = {};
  form: any = {};
  patient: string[] = [];
  
  // Public
  public events;
  public calendar;
  public currentEvent;
  public tempEvents;
  public rd: rdv;
  public onEventChange: BehaviorSubject<any>;
  public onCurrentEventChange: BehaviorSubject<any>;
  public onCalendarChange: BehaviorSubject<any>;
  public currentUse: any;
  public currentUser: User;

  public id: number;

  /**
   * Constructor
   *
   * @param {HttpClient} _httpClient
   */
  constructor(private _httpClient: HttpClient , private tokenstorageservice:TokenStorageService,private token: TokenStorageService) {
    this.onEventChange = new BehaviorSubject({});
    this.onCurrentEventChange = new BehaviorSubject({});
    this.onCalendarChange = new BehaviorSubject({});
  }

  /**
   * Resolver
   *
   * @param {ActivatedRouteSnapshot} route
   * @param {RouterStateSnapshot} state
   * @returns {Observable<any> | Promise<any> | any}
   */
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return new Promise((resolve, reject) => {
      Promise.all([this.getEvents(), this.getCalendar()]).then(res => {
        resolve(res);
      }, reject);
    });
  }

  /**
   * Get Events
   */
  getEvents(): Observable<any[]> {

    this.currentUse = this.token.getUser();
    // get the currentUser details from localStorage
    
     this.id = this.currentUse.id;

    //const url = 'http://localhost:8081/rdv/list';


    return this._httpClient.get<any[]>('http://localhost:8081/api/auth/listmed/' + this.id)
    // return new Promise((resolve, reject) => {
    //   this._httpClient.get(url).subscribe((response: any) => {

    //     console.log("get events response" ,response);
        

    //     this.events = response;
    //     this.tempEvents = response;
    //     this.onEventChange.next(this.events);
    //     resolve(this.events);
    //   }, reject);
    // });
  }

  getPatient(): Promise<any[]> {
    const url = 'http://localhost:8081/patient/listname';

    return new Promise((resolve, reject) => {
      this._httpClient.get(url).subscribe((response: any) => {
        this.patient=response;
      }, reject);
    });
  }

  /**
   * Get Calendar
   */
  getCalendar(): Promise<any[]> {
    const url = `api/calendar-filter`;

    return new Promise((resolve, reject) => {
      this._httpClient.get(url).subscribe((response: any) => {

          console.log('get calendar ' , response);
          

        this.calendar = response;
        this.onCalendarChange.next(this.calendar);
        resolve(this.calendar);
      }, reject);
    });
  }

  /**
   * Create New Event
   */
  createNewEvent() {
    this.currentEvent = {};
    this.onCurrentEventChange.next(this.currentEvent);
  }

  /**
   * Calendar Update
   *
   * @param calendars
   */
  calendarUpdate(calendars) {
    const calendarsChecked = calendars.filter(calendar => {
      return calendar.checked === true;
    });

    let calendarRef = [];
    calendarsChecked.map(res => {
      calendarRef.push(res.filter);
    });
    
    let filteredCalendar = this.tempEvents.filter(event => calendarRef.includes(event.calendar));
    this.events = filteredCalendar;
    this.rd = this.events;
    this.onEventChange.next(this.events);
  }

  /**
   * Delete Event
   *
   * @param event
   */
  deleteEvent(event) {
    return new Promise((resolve, reject) => {
      this._httpClient.delete('http://localhost:8081/rdv/delete/' + event.id).subscribe(response => {
        this.getEvents();
        resolve(response);
      }, reject);
    });
  }

  /**
   * Add Event
   *
   * @param eventForm
   */
  addEvent(eventForm) {
    const newEvent = new rdv();
    
   // newEvent.url = eventForm.url;
    //newEvent.title = eventForm.title;
    newEvent.date = eventForm.start;
    rd.date = eventForm.start;
    //newEvent.end = eventForm.end;
    //newEvent.allDay = eventForm.allDay;
    //  newEvent.calendar = eventForm.selectlabel;
    //eventForm.selectlabel: rdv.date;
    //newEvent.extendedProps.location = eventForm.location;
    //newEvent.extendedProps.description = eventForm.description;
    //newEvent.extendedProps.addGuest = eventForm.addGuest;
    this.currentEvent = rd;
    this.onCurrentEventChange.next(this.currentEvent);
    this.postNewEvent();
  }

  /**
   * Update Event
   *
   * @param eventRef
   */
  updateCurrentEvent(eventRef) {
    const newEvent = new rdv();
    //newEvent.allDay = eventRef.event.allDay;
    newEvent.id = parseInt(eventRef.event.id);
    //newEvent.url = eventRef.event.url;
    //newEvent.title = eventRef.event.title;
    newEvent.date = eventRef.event.start;
    rd.date = eventRef.event.start;

    newEvent.extendedProps.patient = eventRef.event.extendedProps.patient;
        //newEvent.end = eventRef.event.end;
    //   newEvent.calendar = eventRef.event.extendedProps.calendar;
    //newEvent.extendedProps.location = eventRef.event.extendedProps.location;
    //newEvent.extendedProps.description = eventRef.event.extendedProps.description;
    //newEvent.extendedProps.addGuest = eventRef.event.extendedProps.addGuest;
    
    this.currentEvent = newEvent;
//console.log("service ---", this.currentEvent);


    this.onCurrentEventChange.next(this.currentEvent);
  }


  /**
   * Post New Event
   */
  postNewEvent() {
    return new Promise((resolve, reject) => { 
      const url = 'http://localhost:8081/rdv/save';
      this._httpClient.post(url , this.currentEvent).subscribe(response => {
        this.getEvents();
        this.rd = this.currentEvent;
       // console.log("id jdid : "+this.rd.id);
        resolve(response);
      }, reject);
    });
  }

  /**
   * Post Updated Event
   *
   * @param event
   */
  postUpdatedEvent(event) {
//console.log(event);


    return new Promise((resolve, reject) => {
      this._httpClient.post('api/calendar-events/' + event.id, { ...event }).subscribe(response => {
        this.getEvents();
        resolve(response);
      }, reject);
    });
  }
}
