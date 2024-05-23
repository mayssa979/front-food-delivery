import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from 'environments/environment';
import { User, Role } from 'app/auth/models';
import { ToastrService } from 'ngx-toastr';

import { TokenStorageService } from 'app/main/pages/authentication/auth-login-v2/TokenStorageService';

const AUTH_API = 'http://localhost:8081/api/auth/';
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
    this.usersUrl = 'http://localhost:8081/api/auth/signin';
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
   * @param username
   * @param password
   * @returns user
   */
  login(username: string, password: string) {
    return this._http
      .post<any>(`${this.usersUrl}`, { username:username, password:password })
      ;
  }
  log(){
    let url = 'http://localhost:8081/api/v1/login';
    let result = this.http.post(url, {
        userName: this.model.username,
        password: this.model.password
    }).subscribe()
  }
  /*loginn(credentials): Observable<any> {
    return this._http.post(this.usersUrl, {
      username: credentials.username,
      password: credentials.password
    }, options);
  }*/

  logi(credentials): Observable<any> {
    return this.http.post(AUTH_API + 'signin', {
      username: credentials.username,
      password: credentials.password
    }, httpOptions);
  }

  /*authenticate(credentials, callback) {

    const headers = new HttpHeaders(credentials ? {
        authorization : 'Basic ' + btoa(credentials.username + ':' + credentials.password)
    } : {});

    this._http.post(this.usersUrl ,'user', {headers: headers}).subscribe(response => {
        if (response['name']) {
            this.authenticated = true;
        } else {
            this.authenticated = false;
        }
        return callback && callback();
    });

}*/

register(user): Observable<any> {
  return this.http.post(AUTH_API + 'signup', {
    username: user.username,
    email: user.email,
    password: user.password,
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
