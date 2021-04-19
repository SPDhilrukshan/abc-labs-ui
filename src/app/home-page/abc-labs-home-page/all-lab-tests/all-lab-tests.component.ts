import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { GridOptions } from 'ag-grid-community';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { LabTest } from 'src/app/model/lab-test.model';
import { ABCServices } from '../../../constant/ABC-services.service';

@Component({
  selector: 'app-all-lab-tests',
  templateUrl: './all-lab-tests.component.html',
  styleUrls: ['./all-lab-tests.component.scss']
})
export class AllLabTestsComponent implements OnInit {

  gridOptions: GridOptions;
  gridApi: any;
  gridParams: any;
  gridColumnApi: any;
  userType: string;
  labTestSearchForm: FormGroup;
  public labtestCreateModal: BsModalRef;

  @Output() createLabtests = new EventEmitter();

  constructor(    
    private toastr: ToastrService,
    private abcServices: ABCServices,
    private modalService: BsModalService,
  ) { }

  rowData: any[] = [];

  columnDefs = [
    {
      field: "labTestId", headerName: "Lab Test ID", index: 1,
      width: 150, headerTooltip: 'Lab Test ID',
      menuTabs: []
    },
    {
      field: "labTestName", headerName: "Lab Test", index: 6,
      width: 200, editable: false, menuTabs: [], headerTooltip: 'Lab Test'
    },
    {
      field: "labTestdescription", headerName: "Description", index: 9,
      width: 200, editable: false, headerTooltip: 'Description',
      menuTabs: []
    },
    {
      field: "labTestcost", headerName: "Cost", index: 1,
      width: 150, headerTooltip: 'Cost',
      menuTabs: []
    },
    // {
    //   field: "actions", headerName: "actions", index: 9,
    //   width: 200, editable: false, headerTooltip: 'actions',
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
    this.userType = localStorage.getItem('loggedUserType');

    this.labTestSearchForm = new FormGroup({
      labTestName: new FormControl("", [Validators.required]),
    });

    this.getAllLabTests();
  }

  griReadyEvent(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    params.api.sizeColumnsToFit();
    this.gridParams = params.data;
    this.gridApi.setRowData(this.rowData);
  }
  
  createAppointmentFunc(){
    this.createLabtests.emit();
  }

  openModal(LabtestModalRef: any){
    this.labtestCreateModal = this.modalService.show(LabtestModalRef, {
      class: 'modal-xxlg ',
      animated: true,
      keyboard: true,
      backdrop: true,
      ignoreBackdropClick: true
    });
  }

  closeModal(){
    this.labtestCreateModal.hide();
  }

  getAllLabTests(){
    if(this.gridApi){
      this.gridApi.showLoadingOverlay();
    }
    this.abcServices.getAllLabTests().subscribe(res => {
      if(res){
        let labTests: any[] = [];

        labTests = Object.assign(res);

        labTests.forEach(element => {
          element.labTestcost = "Rs. " + element.labTestcost + "/="
        });
        setTimeout(() => {
          this.gridApi.setRowData(labTests);
        }, 500);
      }else{
        this.gridApi.setRowData([]);
        if(this.gridApi){
          this.gridApi.showNoRowsOverlay();
        }
      }
    },error => {
      console.log('FAILED TO LOAD LAB TEST DATA');
      console.log(error);
      this.toastr.error('FAILED TO LOAD LAB TEST DATA', 'Error!', {
        timeOut: 3000,
        progressBar: true,
        closeButton: true
      });
    });
  }

  searchLabTests(event: any) {
    if(this.gridApi){
      this.gridApi.showLoadingOverlay();
    }
    if(this.labTestSearchForm.get('labTestName').value == ''){
      this.getAllLabTests();
    }else{
      this.abcServices.getAllLabTests().subscribe(res => {
        if (res) {
          let labTestList: any = Object.assign(res);
          let filteredlabTest: any[] = [];
  
          labTestList.forEach(element => {
            if(element.labTestName.includes(this.labTestSearchForm.get('labTestName').value)){
              filteredlabTest.push(element);
            }
          });
          this.gridApi.setRowData(filteredlabTest);
        }else{
          if(this.gridApi){
            this.gridApi.showNoRowsOverlay();
          }
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
}
