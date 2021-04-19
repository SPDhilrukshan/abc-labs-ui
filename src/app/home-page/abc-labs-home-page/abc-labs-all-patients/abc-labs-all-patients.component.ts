import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { GridOptions } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { Patient } from '../../../model/patient.model';
import { ABCServices } from '../../../../app/constant/ABC-services.service';
import { DatePipe } from '@angular/common';
import { PatientActionRendererComponent } from './patient-action-renderer/patient-action-renderer.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-abc-labs-all-patients',
  templateUrl: './abc-labs-all-patients.component.html',
  styleUrls: ['./abc-labs-all-patients.component.scss']
})
export class AbcLabsAllPatientsComponent implements OnInit {

  gridOptions: GridOptions;
  gridApi: any;
  gridParams: any;
  gridColumnApi: any;

  isNewPatient: boolean; //true when new patient is clicked
  isEditPatient: boolean;

  patientSearchForm: FormGroup;

  rowData: any[] = [];

  constructor(
    private toastr: ToastrService,
    private abcServices: ABCServices,
    private datePipe: DatePipe,
  ) { }

  columnDefs = [
    {
      field: "patientId", headerName: "MRN", index: 1,
      width: 150, headerTooltip: 'MRN',
      menuTabs: []
    },
    {
      field: "firstName", headerName: "First Name", index: 6,
      width: 200, editable: false, menuTabs: [], headerTooltip: 'First Name'
    },
    {
      field: "lastName", headerName: "Last Name", index: 6,
      width: 200, editable: false, menuTabs: [], headerTooltip: 'Last Name'
    },
    {
      field: "nic", headerName: "NIC", index: 9,
      width: 200, editable: false, headerTooltip: 'NIC',
      menuTabs: []
    },
    {
      field: "dateOfBirth", headerName: "Date Of Birth", index: 7,
      width: 200, editable: false, menuTabs: [], headerTooltip: 'Date Of Birth'
    },
    {
      field: "contactNumber", headerName: "Contact Number", index: 9,
      width: 200, editable: false, headerTooltip: 'Contact Number',
      menuTabs: []
    },
    {
      field: "gender", headerName: "Gender", index: 9,
      width: 200, editable: false, headerTooltip: 'Gender',
      menuTabs: []
    },
    {
      field: "maritalStatus", headerName: "Marital Status", index: 9,
      width: 200, editable: false, headerTooltip: 'Marital Status',
      menuTabs: []
    },
    {
      field: "nationality", headerName: "Nationality", index: 9,
      width: 200, editable: false, headerTooltip: 'Nationality',
      menuTabs: []
    },
    {
      field: "bloodGroup", headerName: "Blood Group", index: 9,
      width: 200, editable: false, headerTooltip: 'Blood Group',
      menuTabs: []
    },
    {
      field: "occupation", headerName: "Occupation", index: 9,
      width: 200, editable: false, headerTooltip: 'Occupation',
      menuTabs: []
    }
    // {
    //   field: "actions", headerName: "actions", index: 9,
    //   width: 200, editable: false, headerTooltip: 'actions', 
    //   // cellRendererFramework: PatientActionRendererComponent,
    //   menuTabs: [], pinned: "right"
    // }
  ];

  ngOnInit() {
    this.gridOptions = {
      pagination: true,
      rowSelection: 'single',
      enableSorting: true,
      enableColResize: true,
      paginationPageSize: 10
    };

    this.patientSearchForm = new FormGroup({
      patientName: new FormControl("", [Validators.required]),
    });

    this.getAllPatients();
  }

  griReadyEvent(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    params.api.sizeColumnsToFit();
    this.gridParams = params.data;
    this.gridApi.setRowData(this.rowData);
  }

  newPatient() {
    this.isNewPatient = true;
  }

  getAllPatients() {
    if(this.gridApi){
      this.gridApi.showLoadingOverlay();
    }
    this.abcServices.getAllPatients().subscribe(res => {
      if (res) {
        let patientsList: any = Object.assign(res);

        patientsList.forEach(element => {
          element.dateOfBirth = this.datePipe.transform(element.dateOfBirth, "dd/MM/yyyy")
        });

        setTimeout(() => {
          this.gridApi.setRowData(patientsList);
        }, 500);
      }else{
        this.gridApi.setRowData([]);
        if(this.gridApi){
          this.gridApi.showNoRowsOverlay();
        }
      }
    }, error => {
      console.log('FAILED TO LOAD PATIENT DATA');
      console.log(error);
      this.toastr.error('FAILED TO LOAD PATIENT DATA', 'Error!', {
        timeOut: 3000,
        progressBar: true,
        closeButton: true
      });
    });
  }

  public refreshGrid() {
    this.getAllPatients();
  }

  searchPatient() {
    this.gridApi.showLoadingOverlay();
    let patientName = this.patientSearchForm.get('patientName').value;
    patientName = patientName.toLowerCase();

    this.abcServices.getAllPatients().subscribe(res => {
      if (res) {
        let allPatients: any[] = [];
        let filteredPatients: any[] = [];

        allPatients = Object.assign(res);

        allPatients.forEach(element => {
          let fullName: string = element.firstName + " " + element.lastName;
          fullName = fullName.toLowerCase();
          if (fullName.includes(patientName)) {
            filteredPatients.push(element);
          }
        });
        this.gridApi.setRowData(filteredPatients);
      }else{
        this.gridApi.setRowData([]);
        if(this.gridApi){
          this.gridApi.showNoRowsOverlay();
        }
      }
    });
  }

  cancelFormSearchPatient() {
    this.gridApi.showLoadingOverlay();
    this.patientSearchForm.get('patientName').patchValue("");
    this.getAllPatients();

  }
}
