import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { GridOptions } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { Employee, EmployeeGridDAO } from '../../../model/employee.model';
import { ABCServices } from '../../../../app/constant/ABC-services.service';
import { AllEmployeeEditActionCellrendererComponent } from './all-employee-edit-action-cellrenderer/all-employee-edit-action-cellrenderer.component';
import { DatePipe } from '@angular/common';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-all-employees',
  templateUrl: './all-employees.component.html',
  styleUrls: ['./all-employees.component.scss']
})
export class AllEmployeesComponent implements OnInit {

  gridOptions: GridOptions;
  gridApi: any;
  gridParams: any;
  gridColumnApi: any;

  constructor(
    private toastr: ToastrService,
    private abcServices: ABCServices,
    private datePipe: DatePipe,
  ) { }

  @Output() newEmployeeEventEmitter = new EventEmitter();

  employeeSearchForm: FormGroup;

  rowData: any[] = [];


  columnDefs = [
    {
      field: "userId", headerName: "Employee ID", index: 1,
      width: 125, headerTooltip: 'Employee ID',
      menuTabs: []
    },
    {
      field: "staffType", headerName: "Staff Type", index: 1,
      width: 130, headerTooltip: 'Staff Type',
      menuTabs: []
    },
    {
      field: "firstName", headerName: "First Name", index: 6,
      width: 150, editable: false, menuTabs: [], headerTooltip: 'First Name'
    },
    {
      field: "lastName", headerName: "Last Name", index: 6,
      width: 150, editable: false, menuTabs: [], headerTooltip: 'Last Name'
    },
    {
      field: "nic", headerName: "NIC", index: 9,
      width: 150, editable: false, headerTooltip: 'NIC',
      menuTabs: []
    },
    {
      field: "dateOfBirth", headerName: "Date Of Birth", index: 7,
      width: 150, editable: false, menuTabs: [], headerTooltip: 'Date Of Birth'
    },
    {
      field: "contactNumber", headerName: "Contact Number", index: 9,
      width: 150, editable: false, headerTooltip: 'Contact Number',
      menuTabs: []
    },
    {
      field: "gender", headerName: "Gender", index: 9,
      width: 150, editable: false, headerTooltip: 'Gender',
      menuTabs: []
    },
    {
      field: "maritalStatus", headerName: "Marital Status", index: 9,
      width: 150, editable: false, headerTooltip: 'Marital Status',
      menuTabs: []
    },
    {
      field: "nationality", headerName: "Nationality", index: 9,
      width: 150, editable: false, headerTooltip: 'Nationality',
      menuTabs: []
    },
    {
      field: "address", headerName: "Address", index: 9,
      width: 200, editable: false, headerTooltip: 'Address',
      menuTabs: []
    },
    {
      field: "email", headerName: "Email Address", index: 9,
      width: 150, editable: false, headerTooltip: 'Email Address',
      menuTabs: []
    }, {
      field: "employeeAcceptStatus", headerName: "Employee Status", index: 9,
      width: 150, editable: false, headerTooltip: 'Employee Status',
      menuTabs: [], pinned: "right"
    },
    {
      field: "actions", headerName: "actions", index: 9,
      width: 100, editable: false, headerTooltip: 'actions', cellRendererFramework: AllEmployeeEditActionCellrendererComponent,
      menuTabs: [], pinned: "right"
    }
  ];

  ngOnInit() {
    this.gridOptions = {
      pagination: true,
      rowSelection: 'single',
      enableSorting: true,
      enableColResize: true,
      paginationPageSize: 10
    };

    this.employeeSearchForm = new FormGroup({
      employeeName: new FormControl("", [Validators.required]),
    });

    this.getAllEmployeesForGrid();
  }

  griReadyEvent(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    // params.api.sizeColumnsToFit();
    this.gridParams = params.data;
    this.gridApi.setRowData(this.rowData);
  }

  createNewEmployee() {
    this.newEmployeeEventEmitter.emit();
  }

  getAllEmployeesForGrid() {
    
    this.abcServices.getAllEmployees().subscribe(res => {
      if (res) {
        let employeesList: any = Object.assign(res);
        employeesList.forEach(element => {
          element.dateOfBirth = this.datePipe.transform(element.dateOfBirth, "dd/MM/yyyy")
        });
        setTimeout(() => {
          this.gridApi.setRowData(employeesList);
        }, 500);
      }
    }, error => {
      console.log('FAILED TO LOAD EMPLOYEE DATA');
      console.log(error);
      this.toastr.error('FAILED TO LOAD EMPLOYEE DATA', 'Error!', {
        timeOut: 3000,
        progressBar: true,
        closeButton: true
      });
    });
  }

  searchEmployees(event: any) {
    this.abcServices.getAllEmployees().subscribe(res => {
      if (res) {
        let employeesList: any = Object.assign(res);
        let filteredEmployees: any[] = [];

        employeesList.forEach(element => {
          element.dateOfBirth = this.datePipe.transform(element.dateOfBirth, "dd/MM/yyyy");
          let fullName = element.firstName + " " + element.lastName;
          if(fullName.includes(this.employeeSearchForm.get('employeeName').value)){
            filteredEmployees.push(element);
          }
        });
        this.gridApi.setRowData(filteredEmployees);
      }
    }, error => {
      console.log('FAILED TO LOAD EMPLOYEE DATA');
      console.log(error);
      this.toastr.error('FAILED TO LOAD EMPLOYEE DATA', 'Error!', {
        timeOut: 3000,
        progressBar: true,
        closeButton: true
      });
    });
  }

}
