import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Patient } from '../../../model/patient.model';
import { ABCServices } from '../../../../app/constant/ABC-services.service';
import { DatePipe } from '@angular/common';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-abc-labs-register-patients',
  templateUrl: './abc-labs-register-patients.component.html',
  styleUrls: ['./abc-labs-register-patients.component.scss']
})
export class AbcLabsRegisterPatientsComponent implements OnInit {

  constructor(
    private toastr: ToastrService,
    private abcServices: ABCServices,
    private datePipe: DatePipe,
    private modalService: BsModalService,
  ) { }

  patientRegisterForm: FormGroup;
  public patientMRNDisplay: BsModalRef;
  registeredPatient: any;
  saveBtnText: string;

  @ViewChild('PatientMRNModal', { static: false }) PatientMRNModal: any;
  @Input() Data: any;
  @Output() updatedPatientDetails = new EventEmitter();
  @Output() closeEditModal = new EventEmitter();


  ngOnInit() {

    this.patientRegisterForm = new FormGroup({
      firstName: new FormControl("", [Validators.required]),
      lastName: new FormControl("", [Validators.required]),
      email: new FormControl("", [Validators.required]),
      nic: new FormControl("", [Validators.required]),
      contactNumber: new FormControl("", []),
      gender: new FormControl("", [Validators.required]),
      maritalStatus: new FormControl("", []),
      nationality: new FormControl("", []),
      address: new FormControl("", []),
      dateOfBirth: new FormControl("", []),
      occupation: new FormControl("", []),
      bloodGroup: new FormControl("", []),
      emppass: new FormControl("", [Validators.required]),
      repassword: new FormControl("", [Validators.required])
    });



    if (this.Data) {
      let dob: string = this.Data.dateOfBirth + "";

      dob = this.datePipe.transform(dob, "DD/MM/YYYY");
      this.patientRegisterForm.get('firstName').patchValue(this.Data.firstName);
      this.patientRegisterForm.get('lastName').patchValue(this.Data.lastName);
      this.patientRegisterForm.get('email').patchValue(this.Data.email);
      this.patientRegisterForm.get('nic').patchValue(this.Data.nic);
      this.patientRegisterForm.get('contactNumber').patchValue(this.Data.contactNumber);
      this.patientRegisterForm.get('gender').patchValue(this.Data.gender);
      this.patientRegisterForm.get('maritalStatus').patchValue(this.Data.maritalStatus);
      this.patientRegisterForm.get('nationality').patchValue(this.Data.nationality);
      this.patientRegisterForm.get('address').patchValue(this.Data.address);
      this.patientRegisterForm.get('dateOfBirth').patchValue(dob)
      this.patientRegisterForm.get('occupation').patchValue(this.Data.occupation);
      this.patientRegisterForm.get('bloodGroup').patchValue(this.Data.bloodGroup);
      this.patientRegisterForm.get('emppass').setValidators([]);
      this.patientRegisterForm.get('repassword').setValidators([]);
      this.saveBtnText = 'Update';
    } else {
      this.saveBtnText = 'Register';
    }

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

  emailValidator(input): boolean {
    return /[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[a-z]{2,4}$/.test(input);
  }

  //return true if validated ok
  passwordValidation(): boolean {
    let password: string = this.patientRegisterForm.get('emppass').value;

    if (password.length > 8 && password.length < 13) {
      return true
    }
    return false;
  }

  savePatient() {
    let patientSaveObj: Patient = new Patient();

    //validations
    if (!this.emailValidator(this.patientRegisterForm.get('email').value)) {
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
      if (this.patientRegisterForm.get('emppass').value != this.patientRegisterForm.get('repassword').value) {
        this.toastr.error('Passwords donot match!', 'Error!', {
          timeOut: 3000,
          progressBar: true,
          closeButton: true
        });
        return;
      }
    }

    let dob: string = this.patientRegisterForm.get('dateOfBirth').value + "";

    dob = this.datePipe.transform(dob, "yyyy-MM-dd HH:mm:ss")

    patientSaveObj.firstName = this.patientRegisterForm.get('firstName').value;
    patientSaveObj.lastName = this.patientRegisterForm.get('lastName').value;
    patientSaveObj.email = this.patientRegisterForm.get('email').value;
    patientSaveObj.nic = this.patientRegisterForm.get('nic').value;
    patientSaveObj.contactNumber = this.patientRegisterForm.get('contactNumber').value;
    patientSaveObj.gender = this.patientRegisterForm.get('gender').value;
    patientSaveObj.maritalStatus = this.patientRegisterForm.get('maritalStatus').value;
    patientSaveObj.nationality = this.patientRegisterForm.get('nationality').value;
    patientSaveObj.address = this.patientRegisterForm.get('address').value;
    patientSaveObj.dateOfBirth = dob;
    patientSaveObj.occupation = this.patientRegisterForm.get('occupation').value;
    patientSaveObj.bloodGroup = this.patientRegisterForm.get('bloodGroup').value;
    patientSaveObj.password = this.patientRegisterForm.get('emppass').value;

    if (this.Data) {
      patientSaveObj.patientId = this.Data.patientId;
    }
    this.abcServices.savePatient(patientSaveObj).subscribe(res => {
      if (res) {
        if (this.Data) {
          this.updatedPatientDetails.emit();
          this.closeEditModal.emit();
          this.toastr.success('Patient Updated successfully!', 'Success!', {
            timeOut: 3000,
            progressBar: true,
            closeButton: true
          });
        } else {
          this.registeredPatient = Object.assign(res);
          this.toastr.success('Patient registered!', 'Success!', {
            timeOut: 3000,
            progressBar: true,
            closeButton: true
          });
          this.closeEditModal.emit();
          this.patientMRNDisplay = this.modalService.show(this.PatientMRNModal, {
            class: 'modal-xxlg ',
            animated: true,
            keyboard: true,
            backdrop: true,
            ignoreBackdropClick: true
          });

        }
      }
    });
  }

  onDateChange(newDate: Date) {
    console.log(this.datePipe.transform(newDate, "yyyy-MM-dd HH:mm:ss"));
  }

  cancelFormPatient() {
    this.patientRegisterForm.reset();
    this.patientRegisterForm.updateValueAndValidity();
  }

  closeModal() {
    this.patientMRNDisplay.hide();
  }
}
