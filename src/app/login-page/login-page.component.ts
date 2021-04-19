import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { ABCServices } from '../constant/ABC-services.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Employee } from '../model/employee.model';

@Component({
  selector: 'login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {

  constructor(
    private toastr: ToastrService,
    private router: Router,
    private abcServices: ABCServices,
    private modalService: BsModalService,
  ) { }


  @Output() loggedIn = new EventEmitter();

  loginForm: FormGroup;
  loginClicked: boolean;
  public patientEditModal: BsModalRef;

  ngOnInit() {
    this.loginForm = new FormGroup({
      username: new FormControl("", [Validators.required]),
      password: new FormControl("", [Validators.required]),
      userType: new FormControl("", [Validators.required])
    });
    // this.loginForm.get('username').valueChanges.subscribe(res => {
    //   this.toastr.success(res, 'Toastr fun!', {
    //     timeOut: 3000})
    // });
  }

  login(event) {
    let username = this.loginForm.get('username').value;
    let password = this.loginForm.get('password').value;
    let userType = this.loginForm.get('userType').value;

    if (username == '' || username == null) {
      this.toastr.error('Please enter a username to login!', 'Error!', {
        timeOut: 3000,
        progressBar: true,
        closeButton: true
      });
    } else if (password == '' || password == null) {
      this.toastr.error('Please enter a password to login!', 'Error!', {
        timeOut: 3000,
        progressBar: true,
        closeButton: true
      });
    }
    if (username && password && userType == 'EMPLOYEE') {
      // network call to login employee
      if(username == 'admin' && password == 'admin123'){
        let adminUser: Employee = new Employee();
        adminUser.userName = username;
        adminUser.staffType = 'ADMIN';
        adminUser.firstName = 'admin';
        adminUser.lastName = 'admin';
        localStorage.setItem("loggedUserName", username);
        localStorage.setItem("loggedUserType", 'ADMIN');
        localStorage.setItem("loggedUserData", JSON.stringify(adminUser));        
        this.loggedIn.emit();
        this.router.navigateByUrl("/dashboard");
      }else{
        this.abcServices.authenticateLogin(username, password).subscribe(res => {
          if (res) {
            let logUser = Object.assign(res);
            localStorage.setItem("loggedUserName", username);
            localStorage.setItem("loggedUserType", logUser.staffType);
            localStorage.setItem("loggedUserData", JSON.stringify(res));
  
            console.log(res);
            this.loggedIn.emit();
            this.router.navigateByUrl("/dashboard");
          } else {
            this.toastr.error("Username or password is incorrect!", "Error!", {
              timeOut: 3000,
              progressBar: true,
              closeButton: true
            });
          }
        }, error => {
          this.toastr.error("Username or password is incorrect!", "Error!", {
            timeOut: 3000,
            progressBar: true,
            closeButton: true
          });
        });
      }
    } else if (username && password && userType == 'PATIENT') {
      // network call to login patient
      this.abcServices.authenticatePatientLogin(username, password).subscribe(res => {
        if (res) {
          let logUser = Object.assign(res);
          localStorage.setItem("loggedUserName", username);
          localStorage.setItem("loggedUserType", "PATIENT");
          localStorage.setItem("loggedUserData", JSON.stringify(res));

          console.log(res);
          this.loggedIn.emit();
          this.router.navigateByUrl("/dashboard");
        } else {
          this.toastr.error("MRN or password is incorrect!", "Error!", {
            timeOut: 3000,
            progressBar: true,
            closeButton: true
          });
        }
      }, error => {
        this.toastr.error("MRN or password is incorrect!", "Error!", {
          timeOut: 3000,
          progressBar: true,
          closeButton: true
        });
      });
    }
  }

  registerPatient() {

  }

  openEmpEditModal(PatientModalRef: any) {
    this.patientEditModal = this.modalService.show(PatientModalRef, {
      class: 'modal-xxlg ',
      animated: true,
      keyboard: true,
      backdrop: true,
      ignoreBackdropClick: true
    });
  }

  closeModal() {
    this.patientEditModal.hide();
  }

}
