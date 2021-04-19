import { Component, forwardRef, Inject, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { ABCServices } from '../../../../constant/ABC-services.service';
import { AbcLabsAllPatientsComponent } from '../abc-labs-all-patients.component';

@Component({
  selector: 'app-patient-action-renderer',
  templateUrl: './patient-action-renderer.component.html',
  styleUrls: ['./patient-action-renderer.component.scss']
})
export class PatientActionRendererComponent implements OnInit, ICellRendererAngularComp {
  params: any;
  data:any;
  gridApi: any;
  public patientEditModal: BsModalRef;

  constructor(
    private modalService: BsModalService,
    private toastr: ToastrService,
    private abcServices: ABCServices,    
    @Inject(forwardRef(() => AbcLabsAllPatientsComponent )) private abcLabsAllPatientsComponent : AbcLabsAllPatientsComponent 
    ){ 

  }

  refresh(params: any): boolean {
    return false;
  }

  ngOnInit() {
  }
      
  agInit(params: any): void {      
    this.params = params;
    this.data=this.params.data;
    this.gridApi = params.api;
  }

  openEmpEditModal(PatientModalRef: any){
    this.patientEditModal = this.modalService.show(PatientModalRef, {
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
    this.patientEditModal.hide();
  }

  updatedPatientDetails(){
    this.abcLabsAllPatientsComponent.refreshGrid();
  }
}
