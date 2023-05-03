import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';
import { LANGUAGES } from 'app/config/language.constants';

import { FinalUserService } from 'app/entities/final-user/service/final-user.service';
import { IFinalUser } from 'app/entities/final-user/final-user.model';
import { HttpResponse } from '@angular/common/http';

const initialAccount: Account = {
  firstName: '',
  lastName: '',
  email: '',
  langKey: '',
  activated: false,
  authorities: [],
  imageUrl: '',
  login: '',
};

@Component({
  selector: 'jhi-settings',
  templateUrl: './settings.component.html',
})
export class SettingsComponent implements OnInit {
  success = false;
  languages = LANGUAGES;

  userLogin: string | null = null;
  finalUser: IFinalUser | null = null;

  settingsForm = new FormGroup({
    firstName: new FormControl(initialAccount.firstName, {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(1), Validators.maxLength(50)],
    }),
    lastName: new FormControl(initialAccount.lastName, {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(1), Validators.maxLength(50)],
    }),
    email: new FormControl(initialAccount.email, {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(5), Validators.maxLength(254), Validators.email],
    }),
    langKey: new FormControl(initialAccount.langKey, { nonNullable: true }),

    activated: new FormControl(initialAccount.activated, { nonNullable: true }),
    authorities: new FormControl(initialAccount.authorities, { nonNullable: true }),
    imageUrl: new FormControl(initialAccount.imageUrl, { nonNullable: true }),
    login: new FormControl(initialAccount.login, { nonNullable: true }),
    pfp: new FormControl<string | null>(null),
    bio: new FormControl<string | null>(null),
  });

  constructor(
    private accountService: AccountService,
    private translateService: TranslateService,
    private finalUserService: FinalUserService
  ) {}

  ngOnInit(): void {
    this.accountService.identity().subscribe(account => {
      if (account) {
        this.userLogin = account.login;

        // Set the initial values for all form controls
        this.settingsForm.patchValue({
          firstName: account.firstName,
          lastName: account.lastName,
          email: account.email,
          langKey: account.langKey,
          activated: account.activated,
          authorities: account.authorities,
          imageUrl: account.imageUrl,
          login: account.login,
          pfp: null,
          bio: null,
        });

        // Retrieve the final user information and set the values for the pfp and bio fields
        this.finalUserService.findByUserLogin(account.login).subscribe((res: HttpResponse<IFinalUser>) => {
          this.finalUser = res.body;
          if (this.finalUser) {
            this.settingsForm.patchValue({
              pfp: this.finalUser.pfp,
              bio: this.finalUser.bio,
            });
          }
        });
      }
    });
    window.onscroll = this.setScroll;
  }

  setScroll(): void {
    if (window.scrollY > 0) document.getElementById('topScroller')!.style.display = 'flex';
    else document.getElementById('topScroller')!.style.display = 'none';
  }

  toTheTop() {
    window.scrollTo({ top: 0 });
    document.getElementById('topScroller')!.style.display = 'none';
  }

  save(): void {
    this.success = false;

    const account = this.settingsForm.getRawValue();
    this.accountService.save(account).subscribe(() => {
      this.success = true;

      this.accountService.authenticate(account);

      if (account.langKey !== this.translateService.currentLang) {
        this.translateService.use(account.langKey);
      }

      if (this.finalUser) {
        this.finalUser.pfp = this.settingsForm.get(['pfp'])?.value;
        this.finalUser.bio = this.settingsForm.get(['bio'])?.value;
        this.finalUser.firstName = this.settingsForm.get(['firstName'])?.value;
        this.finalUser.lastName = this.settingsForm.get(['lastName'])?.value;
        this.finalUserService.update(this.finalUser).subscribe();
      }
    });
  }
  onFileChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.settingsForm.patchValue({
          pfp: reader.result?.toString() || null,
        });
      };
    }
  }
}
