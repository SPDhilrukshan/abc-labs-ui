import { DatePipe } from '@angular/common';
import { Component, forwardRef, Inject, Input, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Billing } from 'src/app/model/billing.model';
import { ABCServices } from '../../../../../app/constant/ABC-services.service';
import { Appointment } from '../../../../model/appointment.model';
import { AllAppointmentsComponent } from '../../all-appointments/all-appointments.component';

@Component({
  selector: 'app-add-billin',
  templateUrl: './add-billin.component.html',
  styleUrls: ['./add-billin.component.scss']
})
export class AddBillinComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private abcServices: ABCServices,
    private datePipe: DatePipe,
    // @Inject(forwardRef(() => AllAppointmentsComponent)) private allAppointmentsComponent: AllAppointmentsComponent
  ) { }

  @Input() Data: Appointment;
  @Input() from: any;

  @Output() closeModal = new EventEmitter();
  @Output() refreshGrid = new EventEmitter();

  cardPaymentForm: FormGroup;
  cashPaymentForm: FormGroup;
  typeOfPaymentForm: FormGroup;
  patientName: string; //network call from Data.patientId
  labTestName: string; //network call from Data.labtestId
  appointmentBillAmount: string; //network call from Data.labtestId
  isCashPayment: boolean;
  isCardPayment: boolean;
  patientData: any;
  labTestData: any;
  userType: string;

  ngOnInit() {
    this.userType = localStorage.getItem('loggedUserType');
    this.getLabTestData(this.Data.labTestId);
    this.getPatientData(this.Data.patientId);
    this.typeOfPaymentForm = this.fb.group({
      paymentType: ['', Validators.required]
    });

    this.cashPaymentForm = this.fb.group({
      paymentAmount: ['', Validators.required]
    });

    this.cardPaymentForm = new FormGroup({
      cardHolderName: new FormControl("", [Validators.required]),
      cardNumber: new FormControl("", [Validators.required]),
      billingAddress: new FormControl("", [Validators.required]),
      cvc: new FormControl("", [Validators.required]),
      expirationMM: new FormControl("", [Validators.required]),
      expirationYYYY: new FormControl("", [Validators.required])
    });

    this.typeOfPaymentForm.get('paymentType').valueChanges.subscribe(res => {
      if (res == 'DEBIT_CARD') {
        this.isCashPayment = false;
        this.isCardPayment = true;
      } else if (res == 'CREDIT_CARD') {
        this.isCashPayment = false;
        this.isCardPayment = true;
      } else if (res == 'CASH') {
        this.isCashPayment = true;
        this.isCardPayment = false;
      }
    });


  }

  getLabTestData(labtestId: number) {
    this.abcServices.getLabTestById(labtestId).subscribe(res => {
      if (res) {
        this.labTestData = Object.assign(res);
        this.labTestName = res.labTestName;
        this.appointmentBillAmount = res.labTestcost;
      }
    });
  }

  getPatientData(patientId: number) {
    this.abcServices.getPatientByPatientId(patientId).subscribe(res => {
      if (res) {
        this.patientData = Object.assign(res);
        this.patientName = res.firstName + " " + res.lastName;
      }
    });
  }

  saveCashPayment() {

    let amountEntered = +this.cashPaymentForm.get('paymentAmount').value;
    if (amountEntered == this.labTestData.labTestcost) {
      let billingSaveObj: Billing = new Billing();

      billingSaveObj.patientId = this.patientData.patientId;
      billingSaveObj.billedAmount = this.labTestData.labTestcost;
      billingSaveObj.billedDate = this.datePipe.transform(new Date(), "yyyy-MM-dd HH:mm:ss");
      billingSaveObj.billingType = this.typeOfPaymentForm.get('paymentType').value;
      billingSaveObj.appointmentId = this.Data.appointmentId;

      this.abcServices.saveBilling(billingSaveObj).subscribe(res => {
        if (res) {
          this.toastr.success('Payment Made Successfully!', 'Success!', {
            timeOut: 3000,
            progressBar: true,
            closeButton: true
          });

          if (this.from == 'ALL_APPOINTMENT') {
            this.refreshGrid.emit();
          }
          this.closeModal.emit();
        }
      });
    } else {
      this.toastr.error('Amount incorrect!', 'Error!', {
        timeOut: 3000,
        progressBar: true,
        closeButton: true
      });
    }
  }

  cancelFormCash() {
    this.cashPaymentForm.reset();
  }

  saveCardPayment() {

    let billingSaveObj: Billing = new Billing();

    billingSaveObj.patientId = this.patientData.patientId;
    billingSaveObj.billedAmount = this.labTestData.labTestcost;
    billingSaveObj.billedDate = this.datePipe.transform(new Date(), "yyyy-MM-dd HH:mm:ss");
    billingSaveObj.billingType = this.typeOfPaymentForm.get('paymentType').value;
    billingSaveObj.appointmentId = this.Data.appointmentId;

    this.abcServices.saveBilling(billingSaveObj).subscribe(res => {
      if (res) {
        this.toastr.success('Payment Made Successfully!', 'Success!', {
          timeOut: 3000,
          progressBar: true,
          closeButton: true
        });

        if (this.from == 'ALL_APPOINTMENT') {
          this.refreshGrid.emit();
        }

        this.closeModal.emit();
      }
    });

  }

  cancelFormCard() {
    this.cardPaymentForm.reset();
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
