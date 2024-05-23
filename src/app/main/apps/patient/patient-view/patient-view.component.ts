import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';

import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { UserViewService } from 'app/main/apps/user/user-view/user-view.service';
import { PatientViewService } from './patient-view.service';
import { UserService } from 'app/auth/service';
import { User } from 'app/auth/models';
import { HttpClient } from '@angular/common/http';
import { PatientService } from 'app/auth/service/patient.service';
import { Patient } from 'app/auth/models/patient';
import { CoreSidebarComponent } from '@core/components/core-sidebar/core-sidebar.component';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';

@Component({
  selector: 'app-patient-view',
  templateUrl: './patient-view.component.html',
  styleUrls: ['./patient-view.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PatientViewComponent implements OnInit, OnDestroy {
  // public
  public url = this.router.url;
  public lastValue;
  public data;
  public id: string;
  //user: User;
  patient: any;

  row: any;
  onInvoiceListChanged: BehaviorSubject<any>;

  // private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {Router} router
   * @param {PatientViewService} _patientViewService
   */
  constructor(private route: ActivatedRoute,private router: Router, private _patientViewService: PatientViewService,private patientService: PatientService,private _httpClient: HttpClient,private _coreSidebarService:CoreSidebarService) {
    this._unsubscribeAll = new Subject();
    this.lastValue = this.url.substr(this.url.lastIndexOf('/') + 1);
  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------
  /**
   * On init
   */
  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.patient= new Patient();
    
    this._patientViewService.onUserViewChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe(response => {
      this.data = response;
    });
     new Promise<void>((resolve, reject) => {
      Promise.all([this.getDataTableRows(Number(this.id))]).then(() => {
        resolve();
      }, reject);
    });

    this.patientService.getByIdPatient(this.id)
      .subscribe(data => {
        console.log(data)
        this.patient = data;
      }, error => console.log(error));
    
  }


  /*deleteEmployee(id: number) {
    this.userService.deleteEmployee(id)
      .subscribe(
        data => {
          console.log(data);
          
        },
        error => console.log(error));
  }*/

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
  
  toggleSidebar(name): void {
    console.log("name !!!",name);
    
    this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
  }
  getDataTableRows(id: number): Promise<any[]> {
    console.log("id :::::::"+this.id);
    const url = `http://localhost:8081/api/auth/listrdvpat/`+this.id;
    return new Promise((resolve, reject) => {
      this._httpClient.get(url).subscribe((response: any) => {
        this.row = response;
        //this.onInvoiceListChanged.next(this.row);
        resolve(this.row);
      }, reject);
    });
  }
}
