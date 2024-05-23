import { Component, HostListener, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NgForm } from '@angular/forms';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { NgModule } from '@angular/core';
import { EmailService } from 'app/main/apps/email/email.service';

@Component({
  selector: 'app-email-compose',
  templateUrl: './email-compose.component.html',
  encapsulation: ViewEncapsulation.None
})
export class EmailComposeComponent implements OnInit {
  // Decorator
  @HostListener('keydown.escape') fn() {
    this.closeCompose();
  }
  @ViewChild('selectRef') private _selectRef: any;
  @ViewChild('composeForm') composeForm: NgForm; // ViewChild for the form
  emailRequest = {
    to: '',
    subject: '',
    body: ''
  };
  // Public
  public emailToSelect = [
    { name: 'Jane Foster', avatar: 'assets/images/portrait/small/avatar-s-3.jpg' },
    { name: 'Donna Frank', avatar: 'assets/images/portrait/small/avatar-s-1.jpg' },
    { name: 'Gabrielle Robertson', avatar: 'assets/images/portrait/small/avatar-s-4.jpg' },
    { name: 'Lori Spears', avatar: 'assets/images/portrait/small/avatar-s-6.jpg' }
  ];

  public emailCCSelect = [
    { name: 'Jane Foster', avatar: 'assets/images/portrait/small/avatar-s-3.jpg' },
    { name: 'Donna Frank', avatar: 'assets/images/portrait/small/avatar-s-1.jpg' },
    { name: 'Gabrielle Robertson', avatar: 'assets/images/portrait/small/avatar-s-4.jpg' },
    { name: 'Lori Spears', avatar: 'assets/images/portrait/small/avatar-s-6.jpg' }
  ];

  public emailBCCSelect = [
    { name: 'Jane Foster', avatar: 'assets/images/portrait/small/avatar-s-3.jpg' },
    { name: 'Donna Frank', avatar: 'assets/images/portrait/small/avatar-s-1.jpg' },
    { name: 'Gabrielle Robertson', avatar: 'assets/images/portrait/small/avatar-s-4.jpg' },
    { name: 'Lori Spears', avatar: 'assets/images/portrait/small/avatar-s-6.jpg' }
  ];

  public emailCCSelected = [];
  public emailBCCSelected = [];

  public isOpenCC = false;
  public isOpenBCC = false;

  public isComposeOpen: boolean = false;

  // Private
  private _unsubscribeAll: Subject<any>;

  /**
   *
   * @param {EmailService} _emailService
   */
  constructor(private _emailService: EmailService) {
    this._unsubscribeAll = new Subject();
  }

  // Public Methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Toggle CC & BCC
   *
   * @param toggleRef
   */
  togglCcBcc(toggleRef) {
    if (toggleRef == 'cc') {
      this.isOpenCC = !this.isOpenCC;
    } else {
      this.isOpenBCC = !this.isOpenBCC;
    }
  }
  sendEmail() {
    if (this.composeForm.valid) {
      // Strip HTML tags from the body content
      const strippedBody = this.emailRequest.body.replace(/<[^>]*>/g, '');
      this.emailRequest.body = strippedBody;
  
      this._emailService.sendEmail(this.emailRequest).subscribe(
        response => {
          console.log('Email sent successfully:', response);
          this.composeForm.reset();
        }
      );
    } else {
      console.log('Form is invalid. Cannot send email.');
     
    }
  }
  handleSuccess(response: any) {
    // Handle the success response here, for example, display a success message
    console.log('Success:', response);
  }
  
  
 
  
  /**
   * Close Compose
   */
  closeCompose() {
    this.sendEmail();
    this.isComposeOpen = false;
    this._emailService.composeEmail(this.isComposeOpen);
  }
  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------
  /**
   * On init
   */
  ngOnInit(): void {
    // Subscribe to Compose Model Changes
    this._emailService.composeEmailChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe(response => {
      this.isComposeOpen = response;
      if (this.isComposeOpen) {
        setTimeout(() => {
          this._selectRef.searchInput.nativeElement.focus();
        }, 0);
      }
    });
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
