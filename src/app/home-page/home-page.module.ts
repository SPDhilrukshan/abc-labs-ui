import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarModule } from 'ng-sidebar';
import { HomePageRoutingModule } from './home-page-routing.module';
import { AbcLabsHomePageComponent } from './abc-labs-home-page/abc-labs-home-page.component';
import { AbcLabsAllPatientsComponent } from './abc-labs-home-page/abc-labs-all-patients/abc-labs-all-patients.component';
// import { AbcLabsRegisterPatientsComponent } from './abc-labs-home-page/abc-labs-register-patients/abc-labs-register-patients.component';
import { AbcLabsHeaderComponent } from '../abc-labs-header/abc-labs-header.component';
import { AbcLabsFooterComponent } from '../abc-labs-footer/abc-labs-footer.component';
import { AgGridModule } from 'ag-grid-angular';
import { LandingPageComponent } from './abc-labs-home-page/landing-page/landing-page.component';
import { AllEmployeesComponent } from './abc-labs-home-page/all-employees/all-employees.component';
// import { RegisterEmployeesComponent } from './abc-labs-home-page/register-employees/register-employees.component';
import { RegisterLabTestsComponent } from './abc-labs-home-page/register-lab-tests/register-lab-tests.component';
import { AllLabTestsComponent } from './abc-labs-home-page/all-lab-tests/all-lab-tests.component';
import { AllAppointmentsComponent } from './abc-labs-home-page/all-appointments/all-appointments.component';
import { CreateAppointmentsComponent } from './abc-labs-home-page/create-appointments/create-appointments.component';
import { ReportsComponent } from './abc-labs-home-page/reports/reports.component';
import { BillingComponent } from './abc-labs-home-page/billing/billing.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { LaddaModule } from 'angular2-ladda';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { AllEmployeeEditActionCellrendererComponent } from './abc-labs-home-page/all-employees/all-employee-edit-action-cellrenderer/all-employee-edit-action-cellrenderer.component';
import {  DatepickerModule, BsDatepickerModule } from 'ngx-bootstrap/datepicker';
// import { DatePipe } from '@angular/common';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { AppointmentActionRendererComponent } from './abc-labs-home-page/all-appointments/appointment-action-renderer/appointment-action-renderer.component';
import { PatientActionRendererComponent } from './abc-labs-home-page/abc-labs-all-patients/patient-action-renderer/patient-action-renderer.component';
// import { DatetimePopupModule } from  'ngx-bootstrap-datetime-popup';
import { TooltipModule } from "ngx-bootstrap/tooltip";
import { OwlDateTimeModule, OwlNativeDateTimeModule } from "ng-pick-datetime";
import { AddBillinComponent } from './abc-labs-home-page/create-appointments/add-billin/add-billin.component';
import { AbcLabsRegisterPatientsComponent } from "../../app/home-page/abc-labs-home-page/abc-labs-register-patients/abc-labs-register-patients.component";
import { RegisterEmployeesComponent } from "../../app/home-page/abc-labs-home-page/register-employees/register-employees.component";

@NgModule({
  declarations: [    
    AbcLabsHomePageComponent,
    AbcLabsAllPatientsComponent,
    AbcLabsRegisterPatientsComponent,    
    AbcLabsHeaderComponent,
    AbcLabsFooterComponent,
    LandingPageComponent,
    AllEmployeesComponent,
    RegisterEmployeesComponent,
    RegisterLabTestsComponent,
    AllLabTestsComponent,
    AllAppointmentsComponent,
    CreateAppointmentsComponent,
    ReportsComponent,
    BillingComponent,
    AllEmployeeEditActionCellrendererComponent,
    AppointmentActionRendererComponent,
    PatientActionRendererComponent,
    AddBillinComponent,
  ],
  imports: [
    CommonModule,
    HomePageRoutingModule,
    SidebarModule.forRoot(),
    AgGridModule.withComponents([]),
    ReactiveFormsModule,
    ToastrModule,
    LaddaModule,
    DatepickerModule.forRoot(),
    BsDatepickerModule.forRoot(),
    TimepickerModule.forRoot(),
    TooltipModule.forRoot(),
    OwlNativeDateTimeModule,
    OwlDateTimeModule
    // DatetimePopupModule
    
    ],
  entryComponents: [
    AllEmployeeEditActionCellrendererComponent,
    AppointmentActionRendererComponent,
    PatientActionRendererComponent,
    
  ],
  providers: [
    // DatePipe
  ],
  exports:[
    AbcLabsRegisterPatientsComponent,
    RegisterEmployeesComponent
  ]
  

})
export class HomePageModule { }
