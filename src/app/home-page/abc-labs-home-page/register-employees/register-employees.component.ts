import { Component, EventEmitter, forwardRef, Inject, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Employee } from '../../../model/employee.model';
import { ABCServices } from '../../../../app/constant/ABC-services.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { AllEmployeesComponent } from '../all-employees/all-employees.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-register-employees',
  templateUrl: './register-employees.component.html',
  styleUrls: ['./register-employees.component.scss']
})
export class RegisterEmployeesComponent implements OnInit {

  constructor(
    private toastr: ToastrService,
    private abcServices: ABCServices,
    private datePipe: DatePipe,
    // @Inject(forwardRef(() => AllEmployeesComponent )) private allEmployeesComponent : AllEmployeesComponent 
  ) { }

  employeeRegisterForm: FormGroup;
  bsConfig: Partial<BsDatepickerConfig>;
  myDateValue: Date;
  saveBtnText: string;

  @Input() Data: any;
  @Output() closeEditModal = new EventEmitter();


  ngOnInit() {
    this.myDateValue = new Date();
    this.bsConfig = Object.assign({}, { containerClass: 'theme-blue' });
    this.employeeRegisterForm = new FormGroup({
      firstName: new FormControl("", [Validators.required]),
      lastName: new FormControl("", [Validators.required]),
      empusern: new FormControl("", [Validators.required]),
      emppass: new FormControl("", [Validators.required]),
      repassword: new FormControl("", [Validators.required]),
      staffType: new FormControl("", [Validators.required]),
      email: new FormControl("", [Validators.required]),
      nic: new FormControl("", [Validators.required]),
      contactNumber: new FormControl("", []),
      gender: new FormControl("", [Validators.required]),
      maritalStatus: new FormControl("", []),
      nationality: new FormControl("", []),
      address: new FormControl("", []),
      dateOfBirth: new FormControl("", []),
      employeeAcceptStatus: new FormControl("", [])
    });



    if (this.Data) {
      // let dob: string = this.Data.dateOfBirth + "";

      // dob = this.datePipe.transform(dob, "DD/MM/YYYY");
      this.employeeRegisterForm.get('firstName').patchValue(this.Data.firstName);
      this.employeeRegisterForm.get('lastName').patchValue(this.Data.lastName);
      this.employeeRegisterForm.get('staffType').patchValue(this.Data.staffType);
      this.employeeRegisterForm.get('email').patchValue(this.Data.email);
      this.employeeRegisterForm.get('nic').patchValue(this.Data.nic);
      this.employeeRegisterForm.get('contactNumber').patchValue(this.Data.contactNumber);
      this.employeeRegisterForm.get('gender').patchValue(this.Data.gender);
      this.employeeRegisterForm.get('maritalStatus').patchValue(this.Data.maritalStatus);
      this.employeeRegisterForm.get('nationality').patchValue(this.Data.nationality);
      this.employeeRegisterForm.get('address').patchValue(this.Data.address);
      this.employeeRegisterForm.get('dateOfBirth').patchValue(this.datePipe.transform(this.Data.dateOfBirth, "yyyy-MM-dd"));
      this.employeeRegisterForm.get('employeeAcceptStatus').patchValue(this.Data.employeeAcceptStatus);
      this.employeeRegisterForm.get('empusern').setValidators([]);
      this.employeeRegisterForm.get('emppass').setValidators([]);
      this.employeeRegisterForm.get('repassword').setValidators([]);
      this.employeeRegisterForm.get('staffType').disable();
      this.saveBtnText = 'Update';
    } else {
      this.saveBtnText = 'Register';
    }
  }

  saveEmployee() {
    let employeeSaveObj: Employee = new Employee();

    if (!this.emailValidator(this.employeeRegisterForm.get('email').value)) {
      this.toastr.error('Please enter a valid email address', 'Error!', {
        timeOut: 3000,
        progressBar: true,
        closeButton: true
      });
      return;
    }

    if (!this.Data) {
      if (!this.passwordValidation()) {
        this.toastr.error('Password should be 8 - 13 characters!', 'Error!', {
          timeOut: 5000,
          progressBar: true,
          closeButton: true
        });
        return;
      }
      if (this.employeeRegisterForm.get('emppass').value != this.employeeRegisterForm.get('repassword').value) {
        this.toastr.error('Passwords donot match!', 'Error!', {
          timeOut: 3000,
          progressBar: true,
          closeButton: true
        });
        return;
      }
    }

    let dob: string = this.employeeRegisterForm.get('dateOfBirth').value + "";

    dob = this.datePipe.transform(dob, "yyyy-MM-dd HH:mm:ss")

    if (this.Data) {
      employeeSaveObj.userId = this.Data.userId;
      employeeSaveObj.userName = this.Data.userName;
      employeeSaveObj.firstName = this.employeeRegisterForm.get('firstName').value;
      employeeSaveObj.lastName = this.employeeRegisterForm.get('lastName').value;
      employeeSaveObj.staffType = this.employeeRegisterForm.get('staffType').value;
      employeeSaveObj.email = this.employeeRegisterForm.get('email').value;
      employeeSaveObj.nic = this.employeeRegisterForm.get('nic').value;
      employeeSaveObj.contactNumber = this.employeeRegisterForm.get('contactNumber').value;
      employeeSaveObj.gender = this.employeeRegisterForm.get('gender').value;
      employeeSaveObj.maritalStatus = this.employeeRegisterForm.get('maritalStatus').value;
      employeeSaveObj.nationality = this.employeeRegisterForm.get('nationality').value;
      employeeSaveObj.address = this.employeeRegisterForm.get('address').value;
      employeeSaveObj.employeeAcceptStatus = this.employeeRegisterForm.get('employeeAcceptStatus').value;
      employeeSaveObj.dateOfBirth = dob;

      this.abcServices.updateEmployee(employeeSaveObj).subscribe(res => {

        if (res) {
          this.toastr.success('Employee updated!', 'Success!', {
            timeOut: 3000,
            progressBar: true,
            closeButton: true
          });
          // this.allEmployeesComponent.ngOnInit();
          this.closeEditModal.emit();
        }
      }, error => {
        console.log('FAILED TO UPDATE EMPLOYEE DATA');
        console.log(error);
        this.toastr.error('FAILED TO UPDATE EMPLOYEE DATA', 'Error!', {
          timeOut: 3000,
          progressBar: true,
          closeButton: true
        });
      });

    } else {
      employeeSaveObj.firstName = this.employeeRegisterForm.get('firstName').value;
      employeeSaveObj.lastName = this.employeeRegisterForm.get('lastName').value;
      employeeSaveObj.userName = this.employeeRegisterForm.get('empusern').value;
      employeeSaveObj.password = this.employeeRegisterForm.get('emppass').value;
      employeeSaveObj.staffType = this.employeeRegisterForm.get('staffType').value;
      employeeSaveObj.email = this.employeeRegisterForm.get('email').value;
      employeeSaveObj.nic = this.employeeRegisterForm.get('nic').value;
      employeeSaveObj.contactNumber = this.employeeRegisterForm.get('contactNumber').value;
      employeeSaveObj.gender = this.employeeRegisterForm.get('gender').value;
      employeeSaveObj.maritalStatus = this.employeeRegisterForm.get('maritalStatus').value;
      employeeSaveObj.nationality = this.employeeRegisterForm.get('nationality').value;
      employeeSaveObj.address = this.employeeRegisterForm.get('address').value;
      employeeSaveObj.employeeAcceptStatus = "NEW";
      employeeSaveObj.dateOfBirth = dob
        ;

      this.abcServices.saveEmployee(employeeSaveObj).subscribe(res => {
        if (res == "Username is not unique") {
          this.toastr.error('Username is not unique!', 'Error!', {
            timeOut: 3000,
            progressBar: true,
            closeButton: true
          });
        }
        if (res) {
          this.toastr.success('Employee registered!', 'Success!', {
            timeOut: 3000,
            progressBar: true,
            closeButton: true
          });
        }
      }, error => {
        console.log('FAILED TO SAVE EMPLOYEE DATA');
        console.log(error);
        this.toastr.error('FAILED TO SAVE EMPLOYEE DATA', 'Error!', {
          timeOut: 3000,
          progressBar: true,
          closeButton: true
        });
      });
    }




  }

  //return true if validated ok
  passwordValidation(): boolean {
    let password: string = this.employeeRegisterForm.get('emppass').value;
    let repassword = this.employeeRegisterForm.get('repassword').value;

    if (password.length > 8 && password.length < 13) {
      return true
    }
    return false;
  }


  public inputValidator(e) {
    let input;
    if (e.metaKey || e.ctrlKey) {
      return true;
    }
    if (e.which === 32) {
      return false;
    }
    if (e.which === 0) {
      return true;
    }
    if (e.which < 33) {
      return true;
    }
    input = String.fromCharCode(e.which);
    return /[\d\s]/.test(input);
  }

  cancelFormEmployee() {
    this.employeeRegisterForm.reset()
  }

  emailValidator(input): boolean {
    return /[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[a-z]{2,4}$/.test(input);
  }

  onDateChange(newDate: Date) {
    console.log(this.datePipe.transform(newDate, "yyyy-MM-dd HH:mm:ss"));
  }
}
