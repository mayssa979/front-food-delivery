import { Component, OnInit, ViewChild , ViewEncapsulation} from '@angular/core';
import { PatientService } from 'app/auth/service/patient.service';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';


export interface Patient {
  cin: number;
  firstname: string;
  lastname: string;
  phone: number;
  tall: number;
  weight: number;
}

@Component({
  selector: 'app-patient',
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PatientComponent implements OnInit {
 // users: Observable<User[]>;
  // Public
  public sidebarToggleRef = false;
  public rows;

  private tempData = [];
  private _unsubscribeAll: Subject<any>;

  constructor(private PatientService: PatientService) {
    this._unsubscribeAll = new Subject();
   }

  ngOnInit(): void {
    this.reloadData();
  }
  // Decorator
  @ViewChild(DatatableComponent) table: DatatableComponent;

  reloadData(){
    this.PatientService.getAllPatient().pipe(takeUntil(this._unsubscribeAll)).subscribe(response => {
      this.rows = response;
      this.tempData = this.rows;
    });
  }

}
