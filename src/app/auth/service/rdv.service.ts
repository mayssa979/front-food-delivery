import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from 'environments/environment';
import { User } from 'app/auth/models';
import { rdv } from '../models/rdv';
const API_URL = 'http://localhost:8080/api/test/';

@Injectable({ providedIn: 'root' })
export class rdvService {
  private baseUrl = 'http://localhost:8081/api/auth/';
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
  

  getAllrdv(id: number): Observable<any>{
    return this._http.get(`${this.baseUrl}/listmed/${id}`);
  }

  getUser(id: number): Observable<any> {
    return this._http.get(`${this.baseUrl}/list/${id}`);
  }

}