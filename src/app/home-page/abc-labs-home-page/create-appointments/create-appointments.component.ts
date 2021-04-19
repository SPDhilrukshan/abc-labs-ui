import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Appointment } from '../../../model/appointment.model';
import { ABCServices } from '../../../../app/constant/ABC-services.service';
import { DatePipe } from '@angular/common';
import { Patient } from '../../../model/patient.model';
import { DateTimeAdapter } from "ng-pick-datetime";
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-create-appointments',
  templateUrl: './create-appointments.component.html',
  styleUrls: ['./create-appointments.component.scss']
})
export class CreateAppointmentsComponent implements OnInit {

  constructor(
    private toastr: ToastrService,
    private abcServices: ABCServices,
    private datePipe: DatePipe,
    private dateTimeAdapter: DateTimeAdapter<any>,
    private modalService: BsModalService,
  ) {
    dateTimeAdapter.setLocale('en-IN');
  }

  appointmentForm: FormGroup;
  patientSearchForm: FormGroup;
  patientDisplayForm: FormGroup;
  labTestData: any[] = [];
  patientData: any;
  isPatientFound: boolean = false;
  @ViewChild('AddBillin',{static: false}) AddBillinModal: any;
  data: any;
  
  public AddBillinDisplay: BsModalRef;

  minDate: Date;
  minTime: Date = new Date();

  ngOnInit() {

    this.minDate = new Date();
    this.appointmentForm = new FormGroup({
      appointmentDate: new FormControl("", [Validators.required]),
      appointmentTime: new FormControl("", []),
      appointmentStatus: new FormControl("REQUESTED", [Validators.required]),
      labTestId: new FormControl("", [Validators.required]),
      patientId: new FormControl("", [Validators.required])
    });

    this.patientSearchForm = new FormGroup({
      patientMrn: new FormControl("", [Validators.required]),
    });

    this.patientDisplayForm = new FormGroup({
      firstName: new FormControl("", []),
      lastName: new FormControl("", []),
      email: new FormControl("", []),
      nic: new FormControl("", []),
      contactNumber: new FormControl("", []),
      gender: new FormControl("", []),
      maritalStatus: new FormControl("", []),
      nationality: new FormControl("", []),
      address: new FormControl("", []),
      dateOfBirth: new FormControl("", []),
      occupation: new FormControl("", []),
      bloodGroup: new FormControl("", [])
    });

    this.getAllLabTests();

    if(localStorage.getItem("loggedUserType") == 'PATIENT'){

      this.patientData = JSON.parse(localStorage.getItem("loggedUserData"));
      this.patientSearchForm.get('patientMrn').patchValue(this.patientData.patientId);
      this.appointmentForm.get('patientId').patchValue(this.patientData.patientId);
      this.patientSearchForm.disable();

    }
  }

  getAllLabTests() {
    this.abcServices.getAllLabTests().subscribe(res => {
      if (res) {
        this.labTestData = Object.assign(res);
      }
    }, error => {
      console.log('FAILED TO LOAD LAB TEST DATA');
      console.log(error);
      this.toastr.error('FAILED TO LOAD LAB TEST DATA', 'Error!', {
        timeOut: 3000,
        progressBar: true,
        closeButton: true
      });
    });
  }

  searchPatient() {
    let patientMrn = this.patientSearchForm.get('patientMrn').value;

    this.abcServices.getPatientByPatientId(patientMrn).subscribe(res => {

      if (res) {
        console.log(res);
        this.patientData = Object.assign(res);
        this.appointmentForm.get('patientId').patchValue(patientMrn);
        this.isPatientFound = true;
      } else {
        this.toastr.warning('No such Patient!', 'Warning!', {
          timeOut: 3000,
          progressBar: true,
          closeButton: true
        });
        this.patientData = null;
        this.appointmentForm.get('patientId').patchValue("");
        this.isPatientFound = false;
      }
    });
  }

  cancelFormSearchPatient() {
    this.patientSearchForm.get('patientMrn').patchValue("");
    this.patientData = null;
  }

  createAppointment() {
    let appointmentSaveObj: Appointment = new Appointment();

    let dob: string = this.appointmentForm.get('appointmentDate').value + "";

    dob = this.datePipe.transform(dob, "yyyy-MM-dd HH:mm:ss");

    appointmentSaveObj.patientId = this.appointmentForm.get('patientId').value;
    appointmentSaveObj.labTestId = this.appointmentForm.get('labTestId').value;
    appointmentSaveObj.appointmentDate = dob;
    appointmentSaveObj.appointmentStatus = this.appointmentForm.get('appointmentStatus').value;

    this.abcServices.getAppointmentsByPatientId(+this.appointmentForm.get('patientId').value).subscribe(res => {
      let appointmentFound: boolean = false;
      if (res) {
        let appointments: any[] = Object.assign(res);
        appointments.forEach(element => {
          if (element.appointmentStatus == 'CONFIRMED') {
            this.toastr.error('Patient already has a confirmed appointment', 'Error!', {
              timeOut: 3000,
              progressBar: true,
              closeButton: true
            });
            appointmentFound = true;
          }
        });
      }
      
      if(!appointmentFound){
        this.abcServices.createAppointment(appointmentSaveObj).subscribe(res1 => {
          if (res1) {
            this.toastr.success('Appointment created!', 'Success!', {
              timeOut: 3000,
              progressBar: true,
              closeButton: true
            });
            this.ngOnInit();
            this.patientData = null;
            this.data = res1;
            //billing
            this.AddBillinDisplay = this.modalService.show(this.AddBillinModal, {
              initialState: {
                Data : res1
              },
              class: 'modal-xxlg ',
              animated: true,
              keyboard: true,
              backdrop: true,
              ignoreBackdropClick: true
            });
          }
        }, error => {
          console.log('FAILED TO CREATE APPOINTMENT');
          console.log(error);
          this.toastr.error('FAILED TO CREATE APPOINTMENT', 'Error!', {
            timeOut: 3000,
            progressBar: true,
            closeButton: true
          });
        });
      }

    }, error => {
      console.log('FAILED TO CREATE APPOINTMENT');
      console.log(error);
      this.toastr.error('FAILED TO CREATE APPOINTMENT', 'Error!', {
        timeOut: 3000,
        progressBar: true,
        closeButton: true
      });
    });

  }

  closeModal(){
    this.AddBillinDisplay.hide();
  }
}
