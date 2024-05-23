import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from 'environments/environment';
import { User } from 'app/auth/models';
const API_URL = 'http://localhost:8080/api/test/';

@Injectable({ providedIn: 'root' })
export class UserService {
  private baseUrl = 'http://localhost:8080/api/v1/auth/';
  /**
   *
   * @param {HttpClient} _http
   */
  constructor(private _http: HttpClient) {}

  /**
   * Get all users
   */
  getAll() {
    return this._http.get<User[]>(`${environment.apiUrl}/users`);
  }

  /**
   * Get user by id
   */
  getById(id: number) {
    return this._http.get<User>(`${environment.apiUrl}/users/${id}`);
  }
  getPublicContent(): Observable<any> {
    return this._http.get(API_URL + 'all', { responseType: 'text' });
  }
  getUserBoard(): Observable<any> {
    return this._http.get(API_URL + 'user', { responseType: 'text' });
  }
  getModeratorBoard(): Observable<any> {
    return this._http.get(API_URL + 'mod', { responseType: 'text' });
  }
  getAdminBoard(): Observable<any> {
    return this._http.get(API_URL + 'admin', { responseType: 'text' });
  }
  

  getAllUser(): Observable<any>{
    return this._http.get(this.baseUrl+'list');
  }

  getUser(id: number): Observable<any> {
    return this._http.get(`${this.baseUrl}list/${id}`);
  }

  deleteEmployee(id: number): Observable<any> {
    return this._http.delete(`${this.baseUrl}delete/${id}`, { responseType: 'text' });
  }

  updateUser(id: number, value: any): Observable<Object> {
    return this._http.put(`${this.baseUrl}update/${id}`, value);
  }

}
