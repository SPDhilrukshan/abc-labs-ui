import { Component, forwardRef, Inject, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { ABCServices } from '../../../../constant/ABC-services.service';
import { AppointmentStatusUpdateDAO } from '../../../../model/appointment.model';
import { AllAppointmentsComponent } from '../all-appointments.component';

@Component({
  selector: 'app-appointment-action-renderer',
  templateUrl: './appointment-action-renderer.component.html',
  styleUrls: ['./appointment-action-renderer.component.scss']
})
export class AppointmentActionRendererComponent implements OnInit, ICellRendererAngularComp {
  params: any;
  data:any;
  gridApi: any;
  userType: string;
  public tumorBoadModalRef: BsModalRef;
  public dischargeModal: BsModalRef;

  constructor(
    private modalService: BsModalService,
    private toastr: ToastrService,
    private abcServices: ABCServices,
    @Inject(forwardRef(() => AllAppointmentsComponent )) private allAppointmentsComponent : AllAppointmentsComponent 
    ){ 

  }

  refresh(params: any): boolean {
    return false;
  }

  ngOnInit() {
    this.userType = localStorage.getItem('loggedUserType')
  }
      
  agInit(params: any): void {      
    this.params = params;
    this.data=this.params.data;
    this.gridApi = params.api;
  }

  openConfirmAppointmentModal(EmpPatientModalRef: any){
    this.tumorBoadModalRef = this.modalService.show(EmpPatientModalRef, {
      initialState: {
        Data: this.data,
      },
      class: 'modal-xxlg ',
      animated: true,
      keyboard: true,
      backdrop: true,
      ignoreBackdropClick: true
    });
  }

  closeModal(){
    this.tumorBoadModalRef.hide();
  }

  confirmAppointment(){
    let appointmentUpdateObj: AppointmentStatusUpdateDAO = new AppointmentStatusUpdateDAO();

    appointmentUpdateObj.appointmentId = this.data.appointmentId;
    appointmentUpdateObj.appointmentStatus = "CONFIRMED";

    this.abcServices.updateAppointmentStatus(appointmentUpdateObj).subscribe(res => {
      if(res){
        this.toastr.success('Appointment Confirmed!', 'Success!', {
          timeOut: 3000,
          progressBar: true,
          closeButton: true
        });
        this.allAppointmentsComponent.refreshGrid();
        this.closeModal();
      }
    },error => {
      console.log('FAILED TO UPDATE APPOINTMENT STATUS');
      console.log(error);
      this.toastr.error('FAILED TO UPDATE APPOINTMENT STATUS', 'Error!', {
        timeOut: 3000,
        progressBar: true,
        closeButton: true
      });
    });
  }

  refreshAppointmnets(){
    this.allAppointmentsComponent.refreshGrid();
  }

  dischargeAppointment(){
    let appointmentUpdateObj: AppointmentStatusUpdateDAO = new AppointmentStatusUpdateDAO();

    appointmentUpdateObj.appointmentId = this.data.appointmentId;
    appointmentUpdateObj.appointmentStatus = "DISCHARGED";

    this.abcServices.updateAppointmentStatus(appointmentUpdateObj).subscribe(res => {
      if(res){
        this.toastr.success('Patient Discharged!', 'Success!', {
          timeOut: 3000,
          progressBar: true,
          closeButton: true
        });
        this.allAppointmentsComponent.refreshGrid()
        this.closeDischargeModal();
      }
    },error => {
      console.log('FAILED TO UPDATE APPOINTMENT STATUS');
      console.log(error);
      this.toastr.error('FAILED TO UPDATE APPOINTMENT STATUS', 'Error!', {
        timeOut: 3000,
        progressBar: true,
        closeButton: true
      });
    });
  }

  openDischargeModal(DischargeModal: any){
    this.dischargeModal = this.modalService.show(DischargeModal, {
      initialState: {
        Data: this.data,
      },
      class: 'modal-xxlg ',
      animated: true,
      keyboard: true,
      backdrop: true,
      ignoreBackdropClick: true
    });
  }

  closeDischargeModal(){
    this.dischargeModal.hide();
  }

  cancelAppointment(){
    let appointmentUpdateObj: AppointmentStatusUpdateDAO = new AppointmentStatusUpdateDAO();

    appointmentUpdateObj.appointmentId = this.data.appointmentId;
    appointmentUpdateObj.appointmentStatus = "CANCELLED";

    this.abcServices.updateAppointmentStatus(appointmentUpdateObj).subscribe(res => {
      if(res){
        this.toastr.success('Appointment Cancelled!', 'Success!', {
          timeOut: 3000,
          progressBar: true,
          closeButton: true
        });
        this.allAppointmentsComponent.refreshGrid()
        this.closeDischargeModal();
      }
    },error => {
      console.log('FAILED TO CANCEL APPOINTMENT STATUS');
      console.log(error);
      this.toastr.error('FAILED TO CANCEL APPOINTMENT STATUS', 'Error!', {
        timeOut: 3000,
        progressBar: true,
        closeButton: true
      });
    });
  }
}
