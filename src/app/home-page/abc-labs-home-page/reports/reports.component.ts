import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { GridOptions } from 'ag-grid-community';
import { DateTimeAdapter } from 'ng-pick-datetime';
import { ToastrService } from 'ngx-toastr';
import { ABCServices } from '../../../constant/ABC-services.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {

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
  billingSearchForm: FormGroup;
  billings: any[] = [];
  totalBillings: any;
  periodDateRange: any;

  columnDefs = [
    {
      field: "billingId", headerName: "Billing Number", index: 1,
      width: 100, headerTooltip: 'Billing Number',
      menuTabs: []
    },
    {
      field: "appointmentId", headerName: "App. Number", index: 1,
      width: 100, headerTooltip: 'Appointment Number',
      menuTabs: []
    },
    {
      field: "patientId", headerName: "MRN", index: 1,
      width: 100, headerTooltip: 'MRN',
      menuTabs: []
    },
    {
      field: "patientName", headerName: "Patient Name", index: 1,
      width: 250, headerTooltip: 'Patient Name',
      menuTabs: []
    },
    {
      field: "billedDate", headerName: "Billing Date", index: 6,
      width: 200, editable: false, menuTabs: [], headerTooltip: 'Billing Date'
    },
    {
      field: "billedAmount", headerName: "Billing Amount", index: 9,
      width: 150, editable: false, headerTooltip: 'Billing Amount',
      menuTabs: []
    },
    {
      field: "billingType", headerName: "Billing Type", index: 6,
      width: 200, editable: false, menuTabs: [], headerTooltip: 'Billing Type'
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

    this.billingSearchForm = new FormGroup({
      patientName: new FormControl("", [Validators.required]),
      billingDateRange: new FormControl("", []),
    });
    
    this.billingSearchForm.get('billingDateRange').valueChanges.subscribe(res =>{
      if(res){
        console.log(res);
      }
    });

    this.getTodayBillings();
  }

  griReadyEvent(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    params.api.sizeColumnsToFit();
    this.gridParams = params.data;
    this.gridApi.setRowData(this.rowData);
  }

  searchBillings(){
    if(this.gridApi){
      this.gridApi.showLoadingOverlay();
    }

    let billingStartDate: any = this.datePipe.transform(this.billingSearchForm.get('billingDateRange').value[0], "yyyy-MM-dd HH:mm:ss");
    let billingEndDate: any = this.datePipe.transform(this.billingSearchForm.get('billingDateRange').value[1], "yyyy-MM-dd HH:mm:ss");

    this.periodDateRange = billingStartDate + " to " + billingEndDate;
    this.abcServices.getBillingInRange(billingStartDate,billingEndDate).subscribe(res => {
      if(res){
        console.log(res);
        this.billings = Object.assign(res);        
        this.totalBillings = 0; 
        this.billings.forEach(element => {
          this.totalBillings += +element.billedAmount;
          element.billedAmount = "Rs. " + element.billedAmount + "/=";
        }); 
        this.gridApi.setRowData(this.billings);    
      }else{
        this.gridApi.setRowData([]);
        if(this.gridApi){
          this.gridApi.showNoRowsOverlay();
        }
      }
    },error =>{
      console.log('FAILED TO LOAD BILLINGS DATA');
      console.log(error);
      this.toastr.error('FAILED TO LOAD BILLINGS DATA', 'Error!', {
        timeOut: 3000,
        progressBar: true,
        closeButton: true
      });
    });
  }

  getTodayBillings(){
    let date = new Date();
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    let billingStartDate: any = this.datePipe.transform(date, "yyyy-MM-dd HH:mm:ss");
    date.setHours(23);
    date.setMinutes(59);
    date.setSeconds(59);
    let billingEndDate: any = this.datePipe.transform(date, "yyyy-MM-dd HH:mm:ss");

    if(this.gridApi){
      this.gridApi.showLoadingOverlay();
    }

    this.periodDateRange = billingStartDate + " to " + billingEndDate;
    this.abcServices.getBillingInRange(billingStartDate,billingEndDate).subscribe(res => {
      if(res){
        console.log(res);
        this.billings = Object.assign(res);
        this.totalBillings = 0;
        this.billings.forEach(element => {
          this.totalBillings += +element.billedAmount;
          element.billedAmount = "Rs. " + element.billedAmount + "/=";
        });
        setTimeout(() => {
          this.gridApi.setRowData(this.billings); 
        }, 500);       
      }else{
        this.gridApi.setRowData([]);
        if(this.gridApi){
          this.gridApi.showNoRowsOverlay();
        }
      }
    },error =>{
      console.log('FAILED TO LOAD BILLINGS DATA');
      console.log(error);
      this.toastr.error('FAILED TO LOAD BILLINGS DATA', 'Error!', {
        timeOut: 3000,
        progressBar: true,
        closeButton: true
      });
    });
  }

  getAllBilling(){
    if(this.gridApi){
      this.gridApi.showLoadingOverlay();
    }
    this.periodDateRange = "";
    this.abcServices.getAllBilling().subscribe(res => {
      if(res){
        console.log(res);
        this.billings = Object.assign(res); 
        this.totalBillings = 0;
        this.billings.forEach(element => {
          this.totalBillings += +element.billedAmount;
          element.billedAmount = "Rs. " + element.billedAmount + "/=";
        });
        this.gridApi.setRowData(this.billings);     
      }else{
        this.gridApi.setRowData([]);
        if(this.gridApi){
          this.gridApi.showNoRowsOverlay();
        }
      }
    },error =>{
      console.log('FAILED TO LOAD BILLINGS DATA');
      console.log(error);
      this.toastr.error('FAILED TO LOAD BILLINGS DATA', 'Error!', {
        timeOut: 3000,
        progressBar: true,
        closeButton: true
      });
    });
  }

}
