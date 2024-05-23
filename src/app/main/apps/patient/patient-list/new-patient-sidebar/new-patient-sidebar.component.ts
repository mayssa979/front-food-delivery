import { Component, OnInit } from '@angular/core';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import { Patient } from 'app/auth/models/patient';
import { PatientService } from 'app/auth/service/patient.service';
import { MDCFormField,MDCFormFieldInput,MDCFormFieldFoundation } from '@material/form-field'


@Component({
  selector: 'app-new-patient-sidebar',
  templateUrl: './new-patient-sidebar.component.html'
})
export class NewPatientSidebarComponent implements OnInit {
  public fullname;
  public username;
  public email;
  employee: Patient = new Patient();
  submitted = false;

  /**
   * Constructor
   *
   * @param {CoreSidebarService} _coreSidebarService
   */
  constructor(private _coreSidebarService: CoreSidebarService, private patientservice: PatientService) {}

  /**
   * Toggle the sidebar
   *
   * @param name
   */
  toggleSidebar(name): void {
    console.log("name ::::",name);
    
    this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
  }

  save() {
    this.patientservice
    .createPatient(this.employee).subscribe(data => {
      console.log(data)
      this.employee = new Patient();
      //this.gotoList();
    }, 
    error => console.log(error));
  }

  submit() {
    this.submitted=true;
    this.save();
  }

  ngOnInit(): void {}
}
