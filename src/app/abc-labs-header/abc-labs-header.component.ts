import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-abc-labs-header',
  templateUrl: './abc-labs-header.component.html',
  styleUrls: ['./abc-labs-header.component.scss']
})
export class AbcLabsHeaderComponent implements OnInit {

  
  public patientEditModal: BsModalRef;
  userType: any;
  userData: any;
  userName: string;

  constructor(
    private router: Router,
    private modalService: BsModalService,
    private toastr: ToastrService,
  ) { }

  @Output() menuOpenClicked = new EventEmitter();
  ngOnInit() {
    this.userType = localStorage.getItem('loggedUserType');
    this.userData = JSON.parse(localStorage.getItem('loggedUserData'));
    this.userName = this.userData.firstName;
  }

  logoutEmployee() {
    this.removeAllLocal();
    localStorage.clear();
    this.router.navigateByUrl('login')
  }

  removeAllLocal(){
    localStorage.removeItem('loggedUserType');
    localStorage.removeItem('loggedUserName');
    localStorage.removeItem('loggedUserData');
  }
  toggleSidebar() {
    this.menuOpenClicked.emit();
  }

  openModal(PatientModalRef: any){
    this.patientEditModal = this.modalService.show(PatientModalRef, {
      
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
}
