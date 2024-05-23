import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { Ng2FlatpickrModule } from 'ng2-flatpickr';

import { CoreCommonModule } from '@core/common.module';
import { CoreDirectivesModule } from '@core/directives/directives';
import { CorePipesModule } from '@core/pipes/pipes.module';
import { CoreSidebarModule } from '@core/components';

import { InvoiceListService } from 'app/main/apps/invoice/invoice-list/invoice-list.service';
import { InvoiceModule } from 'app/main/apps/invoice/invoice.module';

import { PatientEditComponent } from 'app/main/apps/patient/patient-edit/patient-edit.component';
import { PatientEditService } from 'app/main/apps/patient/patient-edit/patient-edit.service';


import { PatientListComponent } from 'app/main/apps/patient/patient-list/patient-list.component';
import { PatientListService } from 'app/main/apps/patient/patient-list/patient-list.service';


//import { PatientViewComponent } from 'app/main/apps/patient/patient-view/patient-view.component';
import { PatientViewComponent } from './patient-view/patient-view.component';
//import { PatientViewService } from 'app/main/apps/patient/patient-view/patient-view.service';
import { PatientViewService } from './patient-view/patient-view.service';
//import { NewUserSidebarComponent } from 'app/main/apps/user/user-list/new-user-sidebar/new-user-sidebar.component';
import { NewPatientSidebarComponent } from './patient-list/new-patient-sidebar/new-patient-sidebar.component';
import { NewAppointmentSidebarComponent } from './patient-view/new-appointment-sidebar/new-appointment-sidebar.component';
//import { CalendarEventSidebarComponent } from '../calendar/calendar-sidebar/calendar-event-sidebar/calendar-event-sidebar.component';


// routing
const routes: Routes = [
  {
    path: 'patient-list',
    component: PatientListComponent,
    resolve: {
      uls: PatientListService
    },
    data: { animation: 'PatientListComponent' }
  },
  {
    path: 'patient-view/:id',
    component: PatientViewComponent,
    resolve: {
      data: PatientViewService
    },
    data: { path: 'view/:id', animation: 'PatientViewComponent' }
  },
  {
    path: 'patient-edit/:id',
    component: PatientEditComponent,
    resolve: {
      ues: PatientEditService
    },
    data: { animation: 'UserEditComponent' }
  },
  {
    path: 'patient-view',
    redirectTo: '/apps/patient/patient-view/2' // Redirection
  },
  {
    path: 'patient-edit',
    redirectTo: '/apps/patient/patient-edit/2' // Redirection
  }
];

@NgModule({
  declarations: [PatientListComponent, PatientViewComponent, PatientEditComponent, NewPatientSidebarComponent, NewAppointmentSidebarComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    CoreCommonModule,
    FormsModule,
    NgbModule,
    NgSelectModule,
    NgxDatatableModule,
    CorePipesModule,
    CoreDirectivesModule,
    Ng2FlatpickrModule,
    InvoiceModule,
    CoreSidebarModule
  ],
  providers: [PatientListService, PatientViewService, PatientEditService]
})
export class PatientModule {}
