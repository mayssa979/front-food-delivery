import { Component, OnInit } from '@angular/core';
import { CoreSidebarService } from '@core/components/core-sidebar/core-sidebar.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthenticationService } from 'app/auth/service';
@Component({
  selector: 'app-new-user-sidebar',
  templateUrl: './new-user-sidebar.component.html'
})
export class NewUserSidebarComponent implements OnInit {
  public firstname;
  public lastname;
  public email;
  public password;
  errorMessage = '';
  form: any = {};
  /**
   * Constructor
   *
   * @param {CoreSidebarService} _coreSidebarService
   */
  constructor(private _coreSidebarService: CoreSidebarService,
    private http : HttpClient,
    private authService: AuthenticationService
  ) {}

  /**
   * Toggle the sidebar
   *
   * @param name
   */
  toggleSidebar(name): void {
    this._coreSidebarService.getSidebarRegistry(name).toggleOpen();
  }

  /**
   * Submit
   *
   * 
   */
  submit(form) {
    const userData = form.value; // Access form data from form.value
    console.log("form", userData);
  
    this.authService.register(userData).subscribe(
      response => {
        this.toggleSidebar('new-user-sidebar');
        
      },
      err => {
        this.errorMessage = err.error.message;
      }
    );
  }

  ngOnInit(): void {
    this.form = {
      firstname: '',
      lastname: '',
      email: '',
      password: '',
      role:'',
      phoneNumber:'',
      address:'',
    };
  }
}
