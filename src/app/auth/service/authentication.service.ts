import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from 'environments/environment';
import { User, Role } from 'app/auth/models';
import { ToastrService } from 'ngx-toastr';

import { TokenStorageService } from 'app/main/pages/authentication/auth-login-v2/TokenStorageService';

const AUTH_API = 'http://localhost:8080/api/v1/auth/';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private role: String;
  private tokenstorageservice: TokenStorageService;
  authenticated = false;
  //public
  public currentUser: Observable<User>;
  model: any = {};
  //private
  private currentUserSubject: BehaviorSubject<User>;
  usersUrl: string;
  

  /**
   *
   * @param {HttpClient} _http
   * @param {ToastrService} _toastrService
   */
  constructor(private _http: HttpClient, private _toastrService: ToastrService, private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
    this.usersUrl = 'http://localhost:8080/api/v1/auth/authenticate';
  }

  // getter: currentUserValue
  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  /**
   *  Confirms if user is admin
   */
   get isAdmin() {
    const user = this.tokenstorageservice.getUser();
    this.role = user.roles;
    return this.currentUser && this.role === Role.Admin;
  }

  /**
   *  Confirms if user is client
   */
  get isClient() {
   
    return this.currentUser && this.currentUserSubject.value.role === Role.Client;
  }
  
  /**
   * User login
   *
   * @param email
   * @param password
   * @returns user
   */
  /*login(email: string, password: string) {
    return this._http
      .post<any>(`${this.usersUrl}`, { email:email, password:password })
      ;
  }
  log(){
    let url = 'localhost:8080/api/v1/auth/authenticate';
    let result = this.http.post(url, {
        email: this.model.username,
        password: this.model.password
    }).subscribe()
  }*/
  

  login(credentials): Observable<any> {
    console.log("aaa", credentials);
    return this.http.post(AUTH_API + 'authenticate', {
      email: credentials.email,
      password: credentials.password
    }, httpOptions);
    
  }


register(user): Observable<any> {
  return this.http.post(AUTH_API + 'register', {
    firstname: user.firstname,
    lastname: user.lastname,
    address: user.address,
    phoneNumber: user.phoneNumber,
    email: user.email,
    password: user.password,
    role:user.role,
  }, httpOptions);
}

  /**
   * User logout
   *
   */
  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    // notify
    this.currentUserSubject.next(null);
  }
}
