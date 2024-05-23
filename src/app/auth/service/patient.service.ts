import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable({
  providedIn: 'root'
})
export class PatientService {
  patientURL: string = "localhost:8080/users";

  selectedData: any;

  constructor(private httpClient : HttpClient) {
  }


  getAllPatient() {
   return this.httpClient.get(this.patientURL+'/');
  }

  getByIdPatient(id: any) {
    return this.httpClient.get(`${this.patientURL}/getUser/${id}`);
  }
  createPatient(patient: any) {

    return this.httpClient.post('localhost:8080/api/v1/auth/register',patient);
  }
  updatePatient(patient: any) {
    return this.httpClient.put(`${this.patientURL}/updateUser`, patient);
  }
  deletePatient(id:any) {
    return this.httpClient.delete(`${this.patientURL}/deleteUser/${id}`);
  }

}
