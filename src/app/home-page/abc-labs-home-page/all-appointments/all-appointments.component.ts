import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { GridOptions } from 'ag-grid-community';
import { Appointment } from '../../../model/appointment.model';
import { ABCServices } from '../../../../app/constant/ABC-services.service';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { AppointmentActionRendererComponent } from './appointment-action-renderer/appointment-action-renderer.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DateTimeAdapter } from 'ng-pick-datetime';

@Component({
  selector: 'app-all-appointments',
  templateUrl: './all-appointments.component.html',
  styleUrls: ['./all-appointments.component.scss']
})
export class AllAppointmentsComponent implements OnInit {

  @Output() createAppointment = new EventEmitter();
  gridOptions: GridOptions;
  gridApi: any;
  gridParams: any;
  gridColumnApi: any;
  range: any = "range";
  calender: any = "calender";
  userType: string;

  constructor(
    private toastr: ToastrService,
    private abcServices: ABCServices,
    private datePipe: DatePipe,
    private dateTimeAdapter: DateTimeAdapter<any>
  ) {
    dateTimeAdapter.setLocale('en-IN');
  }

  rowData: any[] = [];
  patientSearchForm: FormGroup;
  appointments: any[] = [];

  columnDefs = [
    {
      field: "appointmentId", headerName: "App. Number", index: 1,
      width: 100, headerTooltip: 'Appointment Number',
      menuTabs: []
    },
    {
      field: "patientId", headerName: "MRN", index: 6,
      width: 100, editable: false, menuTabs: [], headerTooltip: 'MRN'
    },
    {
      field: "nic", headerName: "NIC", index: 9,
      width: 100, editable: false, headerTooltip: 'NIC',
      menuTabs: []
    },
    {
      field: "patientName", headerName: "Patient Name", index: 1,
      width: 250, headerTooltip: 'Patient Name',
      menuTabs: []
    },
    {
      field: "contactNumber", headerName: "Contact Number", index: 9,
      width: 150, editable: false, headerTooltip: 'Contact Number',
      menuTabs: []
    },
    {
      field: "labTestName", headerName: "Lab Test Name", index: 6,
      width: 200, editable: false, menuTabs: [], headerTooltip: 'Lab Test Name'
    },
    {
      field: "appointmentDate", headerName: "Appointment Date", index: 7,
      width: 150, editable: false, menuTabs: [], headerTooltip: 'Appointment Date'
    },
    {
      field: "appointmentStatus", headerName: "Appointment Status", index: 9,
      width: 150, editable: false, headerTooltip: 'Appointment Status',
      menuTabs: []
    },
    {
      field: "actions", headerName: "actions", index: 9,
      width: 100, editable: false, headerTooltip: 'actions', cellRendererFramework: AppointmentActionRendererComponent,
      menuTabs: [], pinned: "right"
    }
  ];

  ngOnInit() {
    this.userType = localStorage.getItem('loggedUserType');
    this.gridOptions = {
      pagination: true,
      rowSelection: 'single',
      enableSorting: true,
      enableColResize: true,
      paginationPageSize: 10
    };

    this.patientSearchForm = new FormGroup({
      patientName: new FormControl("", [Validators.required]),
      appointmentDateRange: new FormControl("", []),
    });

    if (this.userType == 'PATIENT') {
      this.patientSearchForm.get('patientName').disable();
    }
    this.patientSearchForm.get('appointmentDateRange').valueChanges.subscribe(res => {
      if (res) {
        console.log(res);
      }
    });

    this.getAppointments();
  }

  griReadyEvent(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    params.api.sizeColumnsToFit();
    this.gridParams = params.data;
    this.gridApi.setRowData(this.rowData);
  }

  createAppointmentFunc() {
    this.createAppointment.emit();
  }

  filterAppointmentsByPatientId(appointmentList: any[]): any[] {
    let patientId = JSON.parse(localStorage.getItem('loggedUserData')).patientId;
    let filteredAppointments: any[] = [];
    appointmentList.forEach(appointment => {
      if (appointment.patientId == patientId) {
        filteredAppointments.push(appointment);
      }
    });
    return filteredAppointments;
  }

  getAppointments() {
    if (this.gridApi) {
      this.gridApi.showLoadingOverlay();
    }
    this.abcServices.getAppointmentsForGrid().subscribe(res => {
      if (res) {

        this.appointments = Object.assign(res);
        if (this.userType == 'PATIENT') {
          this.appointments = this.filterAppointmentsByPatientId(this.appointments);
        }
        setTimeout(() => {
          this.gridApi.setRowData(this.appointments);
        }, 500);
      } else {
        this.gridApi.setRowData([]);
        if (this.gridApi) {
          this.gridApi.showNoRowsOverlay();
        }
      }
    }, error => {
      console.log('FAILED TO LOAD APPOINTMENTS DATA');
      console.log(error);
      this.toastr.error('FAILED TO LOAD APPOINTMENTS DATA', 'Error!', {
        timeOut: 3000,
        progressBar: true,
        closeButton: true
      });
    });
  }

  public refreshGrid() {
    this.getAppointments();
  }

  searchPatient() {
    this.gridApi.showLoadingOverlay();
    let patientName = this.patientSearchForm.get('patientName').value;
    patientName = patientName.toLowerCase();
    let filteredAppointments: any[] = [];

    this.appointments.forEach(appointment => {
      if (appointment.patientName.toLowerCase().includes(patientName.toLowerCase())) {
        filteredAppointments.push(appointment);
      }
    });

    this.gridApi.setRowData(filteredAppointments);
  }

  cancelFormSearchPatient() {
    this.gridApi.showLoadingOverlay();
    this.patientSearchForm.reset();
    this.getAppointments();
  }

  searchAppointments() {
    this.gridApi.showLoadingOverlay();
    console.log(this.patientSearchForm.get('appointmentDateRange').value)

    let appointmentStartDate: any = this.datePipe.transform(this.patientSearchForm.get('appointmentDateRange').value[0], "yyyy-MM-dd HH:mm:ss");
    let appointmentEndDate: any = this.datePipe.transform(this.patientSearchForm.get('appointmentDateRange').value[1], "yyyy-MM-dd HH:mm:ss");

    this.abcServices.getAppointmentsByDateRange(appointmentStartDate, appointmentEndDate).subscribe(res => {
      if (res) {
        console.log(res);
        this.appointments = Object.assign(res);
        if (this.userType == 'PATIENT') {
          this.appointments = this.filterAppointmentsByPatientId(this.appointments);
        }
        this.gridApi.setRowData(this.appointments);
      } else {
        this.gridApi.setRowData([]);
        if (this.gridApi) {
          this.gridApi.showNoRowsOverlay();
        }
      }
    });
  }
}
