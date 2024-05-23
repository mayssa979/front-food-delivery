import { Component, OnInit, OnDestroy, ViewEncapsulation, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FlatpickrOptions } from 'ng2-flatpickr';
import { cloneDeep } from 'lodash';
import { HttpClient } from '@angular/common/http';
import { UserEditService } from 'app/main/apps/user/user-edit/user-edit.service';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UserEditComponent implements OnInit, OnDestroy {
  // Public
  public url = this.router.url;
  public urlLastValue;
  public rows;
  public currentRow;
  public tempRow;
  public avatarImage: string;

  @ViewChild('accountForm') accountForm: NgForm;

  public birthDateOptions: FlatpickrOptions = {
    altInput: true
  };

  public selectMultiLanguages = ['English', 'Spanish', 'French', 'Russian', 'German', 'Arabic', 'Sanskrit'];
  public selectMultiLanguagesSelected = [];

  // Private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {Router} router
   * @param {UserEditService} _userEditService
   */
  constructor(private router: Router, private _userEditService: UserEditService, private _httpClient: HttpClient) {
    this._unsubscribeAll = new Subject();
    this.urlLastValue = this.url.substr(this.url.lastIndexOf('/') + 1);
  }

  // Public Methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Reset Form With Default Values
   */
  resetFormWithDefaultValues() {
    this.accountForm.resetForm(this.tempRow);
  }

  /**
   * Upload Image
   *
   * @param event
   */
  uploadImage(event: any) {
    if (event.target.files && event.target.files[0]) {
      let reader = new FileReader();

      reader.onload = (event: any) => {
        this.avatarImage = event.target.result;
      };

      reader.readAsDataURL(event.target.files[0]);
    }
  }

  /**
   * Submit
   *
   * @param form
   */
  submit(form) {
    // Convert form data to JSON object
    const formData = {
      // Assuming you want to send specific fields from the form
      // Adjust these fields according to your form structure
      id: this.currentRow.id,
      firstname: form.value.firstname,
      email: form.value.email,
      lastname: form.value.lastname,
      phoneNumber: form.value.phone,
      role: this.currentRow.role,
      password: this.currentRow.password,
      address: form.value.address,
      // Add other fields as needed
    };
console.log("form id", this.currentRow.password);
    this._httpClient.put('http://localhost:8080/users/updateUser', formData).subscribe(res => {
      console.log("user updated! ", res);
      this.router.navigateByUrl('/apps/user/user-list');
    }, error => {
      console.error("Error updating user:", error);
    });
  
  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------
  /**
   * On init
   */
  
  ngOnInit(): void {
    const userId = this.urlLastValue; 
    this._userEditService.onUserEditChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe(response => {
      this.rows = response;
      console.log('edit this user ', response);
          this.currentRow = response;
          
         // this.avatarImage = this.currentRow.avatar;
          this.tempRow = cloneDeep(response);
        
    
    });
   // Assuming this contains the ID of the user to be edited
   /* console.log('id this user', userId);
  this._userEditService.getApiData(userId).then(response => {
    this.rows = response;
    this.rows.map(row => {
      if (row.id === userId) {
        this.currentRow = row;
        console.log('edit this user', row);
        this.avatarImage = this.currentRow.avatar;
        this.tempRow = cloneDeep(row);
      }
    });
  }).catch(error => {
    console.error('Error fetching user data:', error);
  });*/
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
