import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';

import { EMAIL_ALREADY_USED_TYPE, LOGIN_ALREADY_USED_TYPE } from 'app/config/error.constants';
import { RegisterService } from './register.service';

@Component({
  selector: 'jhi-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements AfterViewInit {
  @ViewChild('login', { static: false })
  login?: ElementRef;

  doNotMatch = false;
  error = false;
  errorEmailExists = false;
  errorUserExists = false;
  success = false;
  termsAndConditionsChecked = false;

  public xyz = '';

  registerForm = new FormGroup({
    login: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(50),
        Validators.pattern('^[a-zA-Z0-9!$&*+=?^_`{|}~.-]+@[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)*$|^[_.@A-Za-z0-9-]+$'),
      ],
    }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(5), Validators.maxLength(254), Validators.email],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(4), Validators.maxLength(50)],
    }),
    confirmPassword: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(4), Validators.maxLength(50)],
    }),
    studyYear: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    course: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    modules: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    bio: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(1), Validators.maxLength(2000)],
    }),
    firstname: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    lastname: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  userModulesData: any[] = [];

  constructor(private translateService: TranslateService, private registerService: RegisterService, private http: HttpClient) {}

  ngOnInit() {
    this.http.get<any[]>('/api/user-modules').subscribe(data => {
      this.userModulesData = data;
    });
  }

  ngAfterViewInit(): void {
    if (this.login) {
      this.login.nativeElement.focus();
    }
  }

  register(): void {
    console.log('In register()');
    this.doNotMatch = false;
    this.error = false;
    this.errorEmailExists = false;
    this.errorUserExists = false;

    const { password, confirmPassword, login, email, studyYear, bio, firstname, lastname } = this.registerForm.getRawValue();
    const modules = this.xyz;
    if (password !== confirmPassword) {
      this.doNotMatch = true;
    } else {
      this.registerService
        .save(
          {
            login,
            email,
            password,
            langKey: this.translateService.currentLang,
          },
          studyYear,
          bio,
          modules,
          firstname,
          lastname
        )
        .subscribe({ next: () => (this.success = true), error: response => this.processError(response) });
    }
  }

  private processError(response: HttpErrorResponse): void {
    if (response.status === 400 && response.error.type === LOGIN_ALREADY_USED_TYPE) {
      this.errorUserExists = true;
    } else if (response.status === 400 && response.error.type === EMAIL_ALREADY_USED_TYPE) {
      this.errorEmailExists = true;
    } else {
      this.error = true;
    }
  }
  handleMentorCheckboxChange(event: any) {
    const checkboxValues = this.xyz.split(',').filter(x => x);

    if (event.target.checked) {
      if (!checkboxValues.includes('isMentor')) {
        checkboxValues.push('isMentor');
      }
    } else {
      const index = checkboxValues.indexOf('isMentor');
      if (index > -1) {
        checkboxValues.splice(index, 1);
      }
    }

    this.xyz = checkboxValues.join(',');
  }

  handleCheckboxChange(event: any, option: string) {
    const checkboxValues = this.xyz.split(',').filter(x => x);

    if (event.target.checked) {
      checkboxValues.push(option);
    } else {
      const index = checkboxValues.indexOf(option);
      if (index > -1) {
        checkboxValues.splice(index, 1);
      }
    }

    this.xyz = checkboxValues.join(',');
  }
}
