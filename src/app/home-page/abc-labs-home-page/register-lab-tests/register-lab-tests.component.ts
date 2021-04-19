import { Component, OnInit, Output,EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { LabTest } from '../../../model/lab-test.model';
import { ABCServices } from '../../../constant/ABC-services.service';

@Component({
  selector: 'app-register-lab-tests',
  templateUrl: './register-lab-tests.component.html',
  styleUrls: ['./register-lab-tests.component.scss']
})
export class RegisterLabTestsComponent implements OnInit {

  labTestRegisterForm: FormGroup;
  @Output() refeshGrid = new EventEmitter();
  @Output() closeModal = new EventEmitter();

  constructor(
    private toastr: ToastrService,
    private abcServices: ABCServices
  ) { }

  ngOnInit() {
    this.labTestRegisterForm = new FormGroup({
      labTestName: new FormControl("", [Validators.required]),
      labTestdescription: new FormControl("", [Validators.required]),
      labTestcost: new FormControl("", [Validators.required])
    });
  }

  saveLabTesTForm(){

    let labTestSaveObj: LabTest = new LabTest();

    labTestSaveObj.labTestName = this.labTestRegisterForm.get('labTestName').value;
    labTestSaveObj.labTestdescription = this.labTestRegisterForm.get('labTestdescription').value;
    labTestSaveObj.labTestcost = this.labTestRegisterForm.get('labTestcost').value;

    this.abcServices.saveLabTest(labTestSaveObj).subscribe(res => {
      if(res){
        this.toastr.success('Lab Test saved sucessfully!', 'Success!', {
          timeOut: 3000,
          progressBar: true,
          closeButton: true
        });
        this.refeshGrid.emit();
        this.closeModal.emit();
      }
    },error => {
        console.log('FAILED TO SAVE LAB TEST DATA');
        console.log(error);
        this.toastr.error('FAILED TO SAVE LAB TEST DATA', 'Error!', {
          timeOut: 3000,
          progressBar: true,
          closeButton: true
        });
      });
    
  }

  cancelLabTesTForm(){
    this.labTestRegisterForm.reset();
    this.closeModal.emit();
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
}
