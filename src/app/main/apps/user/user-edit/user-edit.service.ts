import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';

import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class UserEditService implements Resolve<any> {
  public apiData: any;
  public onUserEditChanged: BehaviorSubject<any>;

  /**
   * Constructor
   *
   * @param {HttpClient} _httpClient
   */
  constructor(private _httpClient: HttpClient) {
    // Set the defaults
    this.onUserEditChanged = new BehaviorSubject({});
  }

  /**
   * Resolver
   *
   * @param {ActivatedRouteSnapshot} route
   * @param {RouterStateSnapshot} state
   * @returns {Observable<any> | Promise<any> | any}
   */
 /* resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return new Promise<void>((resolve, reject) => {
      Promise.all([this.getApiData()]).then(() => {
        resolve();
      }, reject);
    });
  }*/
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    const userId = route.params['id']; // Assuming 'id' is the parameter name in the route
  
    return new Promise<void>((resolve, reject) => {
      this.getApiData(userId).then(() => {
        resolve();
      }).catch(error => {
        console.error('Error resolving data:', error);
        reject(error);
      });
    });
  }

  /**
   * Get API Data
   */
  /*getApiData(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this._httpClient.get('/api/users-data').subscribe((response: any) => {
        this.apiData = response;
        this.onUserEditChanged.next(this.apiData);
        
        resolve(this.apiData);
      }, reject);
    });
  }*/
  getApiData(id: number): Promise<any> {
    const url = `http://localhost:8080/users/getUser/${id}`; // Assuming the backend URL pattern for fetching user data is like this
  
    return new Promise((resolve, reject) => {
      this._httpClient.get(url).subscribe((response: any) => {
        console.log("edited user ", response);
        this.apiData = response;
        this.onUserEditChanged.next(this.apiData);
        
        resolve(this.apiData);
      }, reject);
    });
  }
}
