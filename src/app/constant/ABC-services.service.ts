import { Injectable, Inject, EventEmitter } from '@angular/core';
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable } from 'rxjs';
import { Constants } from './constants';
// import { Observable } from 'rxjs/Rx';

@Injectable({
    providedIn: 'root'
})
export class ABCServices {

    constructor(private http: HttpClient) { }

    authenticateLogin(username: string, password: string): Observable<any> {
        let obs = new Observable<any>(obs => {
          this.http.get(Constants.SERVER_URL + Constants.EMPLOYEE_CONTROLLER + "/authorize-login/username/" + username + "/password/" + password).subscribe(res => {
            
              obs.next(res);
              obs.complete();
          }, error => {
            obs.error(error);
            console.log(error)
            obs.complete();
          });
        });
    
        return obs;
      } 

      authenticatePatientLogin(username: string, password: string): Observable<any> {
        let obs = new Observable<any>(obs => {
          this.http.get(Constants.SERVER_URL + Constants.PATIENT_CONTROLLER + "/authorize/username/" + username + "/password/" + password).subscribe(res => {
            
              obs.next(res);
              obs.complete();
          }, error => {
            obs.error(error);
            console.log(error)
            obs.complete();
          });
        });
    
        return obs;
      } 

      saveEmployee(employeeObj): Observable<any> {
        let obs = new Observable<any>(obs => {
          this.http.post(Constants.SERVER_URL + Constants.EMPLOYEE_CONTROLLER, employeeObj).subscribe(res => {
            
              obs.next(res);
              obs.complete();
          }, error => {
            obs.error(error);
            console.log(error)
            obs.complete();
          });
        });
    
        return obs;
      } 

      updateEmployee(employeeObj): Observable<any> {
        let obs = new Observable<any>(obs => {
          this.http.post(Constants.SERVER_URL + Constants.EMPLOYEE_CONTROLLER + "/update/", employeeObj).subscribe(res => {            
              obs.next(res);
              obs.complete();
          }, error => {
            obs.error(error);
            console.log(error)
            obs.complete();
          });
        });
    
        return obs;
      }

      getAllEmployees(): Observable<any> {
        let obs = new Observable<any>(obs => {
          this.http.get(Constants.SERVER_URL + Constants.EMPLOYEE_CONTROLLER + "/all-employees/").subscribe(res => {
            
              obs.next(res);
              obs.complete();
          }, error => {
            obs.error(error);
            console.log(error)
            obs.complete();
          });
        });
    
        return obs;
      } 

      savePatient(patientObj): Observable<any> {
        let obs = new Observable<any>(obs => {
          this.http.post(Constants.SERVER_URL + Constants.PATIENT_CONTROLLER, patientObj).subscribe(res => {            
              obs.next(res);
              obs.complete();
          }, error => {
            obs.error(error);
            console.log(error)
            obs.complete();
          });
        });
    
        return obs;
      }
      
      getAllPatients(): Observable<any> {
        let obs = new Observable<any>(obs => {
          this.http.get(Constants.SERVER_URL + Constants.PATIENT_CONTROLLER + "/all-patients/").subscribe(res => {            
              obs.next(res);
              obs.complete();
          }, error => {
            obs.error(error);
            console.log(error)
            obs.complete();
          });
        });
    
        return obs;
      } 

      saveLabTest(labTestOj): Observable<any> {
        let obs = new Observable<any>(obs => {
          this.http.post(Constants.SERVER_URL + Constants.LAB_TEST_CONTROLLER, labTestOj).subscribe(res => {            
              obs.next(res);
              obs.complete();
          }, error => {
            obs.error(error);
            console.log(error)
            obs.complete();
          });
        });    
        return obs;
      }

      getAllLabTests(): Observable<any> {
        let obs = new Observable<any>(obs => {
          this.http.get(Constants.SERVER_URL + Constants.LAB_TEST_CONTROLLER + "/all-lab-tests/").subscribe(res => {            
              obs.next(res);
              obs.complete();
          }, error => {
            obs.error(error);
            console.log(error)
            obs.complete();
          });
        });    
        return obs;
      }

      getPatientByPatientId(patientMrn: number): Observable<any> {
        let obs = new Observable<any>(obs => {
          this.http.get(Constants.SERVER_URL + Constants.PATIENT_CONTROLLER + "/patient-id-tier2/" + patientMrn).subscribe(res => {            
              obs.next(res);
              obs.complete();
          }, error => {
            obs.error(error);
            console.log(error)
            obs.complete();
          });
        });    
        return obs;
      }

      createAppointment(appointmentOj): Observable<any> {
        let obs = new Observable<any>(obs => {
          this.http.post(Constants.SERVER_URL + Constants.APPOINTMENT_CONTROLLER, appointmentOj).subscribe(res => {            
              obs.next(res);
              obs.complete();
          }, error => {
            obs.error(error);
            console.log(error)
            obs.complete();
          });
        });    
        return obs;
      }

      getAppointmentsForGrid(): Observable<any> {
        let obs = new Observable<any>(obs => {
          this.http.get(Constants.SERVER_URL + Constants.APPOINTMENT_CONTROLLER + "/grid").subscribe(res => {            
              obs.next(res);
              obs.complete();
          }, error => {
            obs.error(error);
            console.log(error)
            obs.complete();
          });
        });    
        return obs;
      }

      updateAppointmentStatus(appointmentUpdateOj): Observable<any> {
        let obs = new Observable<any>(obs => {
          this.http.post(Constants.SERVER_URL + Constants.APPOINTMENT_CONTROLLER + "/update/appointment-status", appointmentUpdateOj).subscribe(res => {            
              obs.next(res);
              obs.complete();
          }, error => {
            obs.error(error);
            console.log(error)
            obs.complete();
          });
        });    
        return obs;
      }

      getAppointmentsByPatientId(patientId: number): Observable<any> {
        let obs = new Observable<any>(obs => {
          this.http.get(Constants.SERVER_URL + Constants.APPOINTMENT_CONTROLLER + "/patient-id/"+patientId).subscribe(res => {            
              obs.next(res);
              obs.complete();
          }, error => {
            obs.error(error);
            console.log(error)
            obs.complete();
          });
        });    
        return obs;
      }

      getAppointmentsByDateRange(startDate: string, endDate: string): Observable<any> {
        let obs = new Observable<any>(obs => {
          this.http.get(Constants.SERVER_URL + Constants.APPOINTMENT_CONTROLLER + "/date-range/start-date/"+ startDate +"/end-date/" + endDate).subscribe(res => {            
              obs.next(res);
              obs.complete();
          }, error => {
            obs.error(error);
            console.log(error)
            obs.complete();
          });
        });    
        return obs;
      }

      updateEmployeeStatus(employeeUpdateOj: any): Observable<any> {
        let obs = new Observable<any>(obs => {
          this.http.post(Constants.SERVER_URL + Constants.EMPLOYEE_CONTROLLER + "/update/status", employeeUpdateOj).subscribe(res => {            
              obs.next(res);
              obs.complete();
          }, error => {
            obs.error(error);
            console.log(error)
            obs.complete();
          });
        });    
        return obs;
      }

      getLabTestById(labTestId: number): Observable<any> {
        let obs = new Observable<any>(obs => {
          this.http.get(Constants.SERVER_URL + Constants.LAB_TEST_CONTROLLER + "/lab-test/" + labTestId).subscribe(res => {            
              obs.next(res);
              obs.complete();
          }, error => {
            obs.error(error);
            console.log(error)
            obs.complete();
          });
        });    
        return obs;
      }

      saveBilling(billingOj: any): Observable<any> {
        let obs = new Observable<any>(obs => {
          this.http.post(Constants.SERVER_URL + Constants.APPOINTMENT_CONTROLLER + "/billing", billingOj).subscribe(res => {            
              obs.next(res);
              obs.complete();
          }, error => {
            obs.error(error);
            console.log(error)
            obs.complete();
          });
        });    
        return obs;
      }

      getAllBilling(): Observable<any> {
        let obs = new Observable<any>(obs => {
          this.http.get(Constants.SERVER_URL + Constants.APPOINTMENT_CONTROLLER + "/all-billing/").subscribe(res => {            
              obs.next(res);
              obs.complete();
          }, error => {
            obs.error(error);
            console.log(error)
            obs.complete();
          });
        });    
        return obs;
      }

      getBillingInRange(startDate: string, endDate: string): Observable<any> {
        let obs = new Observable<any>(obs => {
          this.http.get(Constants.SERVER_URL + Constants.APPOINTMENT_CONTROLLER +"/billing-date-range/start-date/"+ startDate +"/end-date/" + endDate).subscribe(res => {            
              obs.next(res);
              obs.complete();
          }, error => {
            obs.error(error);
            console.log(error)
            obs.complete();
          });
        });    
        return obs;
      }
}
