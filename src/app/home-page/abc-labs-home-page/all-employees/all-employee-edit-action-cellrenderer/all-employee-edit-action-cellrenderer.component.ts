import { Component, forwardRef, Inject, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { EmployeeStatusUpdateDAO } from '../../../../../app/model/employee.model';
import { ABCServices } from '../../../../../app/constant/ABC-services.service';
import { AllEmployeesComponent } from "../all-employees.component";

@Component({
  selector: 'app-all-employee-edit-action-cellrenderer',
  templateUrl: './all-employee-edit-action-cellrenderer.component.html',
  styleUrls: ['./all-employee-edit-action-cellrenderer.component.scss']
})
export class AllEmployeeEditActionCellrendererComponent implements OnInit, ICellRendererAngularComp {
  params: any;
  data: any;
  gridApi: any;
  public tumorBoadModalRef: BsModalRef;
  loggedUserType: string;


  constructor(
    private modalService: BsModalService,
    private toastr: ToastrService,
    private abcServices: ABCServices,
    @Inject(forwardRef(() => AllEmployeesComponent )) private allEmployeesComponent : AllEmployeesComponent 
  ) {

  }

  refresh(params: any): boolean {
    return false;
  }

  ngOnInit() {
    this.loggedUserType = localStorage.getItem('loggedUserType');
  }

  agInit(params: any): void {
    this.params = params;
    this.data = this.params.data;
    this.gridApi = params.api;
  }

  openEmpEditModal(EmpPatientModalRef: any) {
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

  closeModal() {
    this.tumorBoadModalRef.hide();
  }

  updateEmployeeRegistration(status: string) {

    let employeeStatusUpdateDAO: EmployeeStatusUpdateDAO = new EmployeeStatusUpdateDAO();

    employeeStatusUpdateDAO.employeeId = this.data.userId;
    employeeStatusUpdateDAO.employeeStatus = status;

    this.abcServices.updateEmployeeStatus(employeeStatusUpdateDAO).subscribe(res => {
      if (res) {
        this.toastr.success('EMPLOYEE ' + employeeStatusUpdateDAO.employeeStatus + '!', 'Success!', {
          timeOut: 3000,
          progressBar: true,
          closeButton: true
        });
        this.closeModal();
        this.allEmployeesComponent.getAllEmployeesForGrid();
      }
    }, error => {
      this.toastr.error('Employee status update error', 'Error!', {
        timeOut: 3000,
        progressBar: true,
        closeButton: true
      });
      this.closeModal();
    });
  }
}
