import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';
import { LANGUAGES } from 'app/config/language.constants';

import { UserExtraService } from 'app/entities/user-extra/service/user-extra.service';
import { IUserExtra } from 'app/entities/user-extra/user-extra.model';
import { HttpResponse } from '@angular/common/http';

const initialAccount: Account = {} as Account;

@Component({
  selector: 'jhi-settings',
  templateUrl: './settings.component.html',
})
export class SettingsComponent implements OnInit {
  success = false;
  languages = LANGUAGES;

  userLogin: string | null = null;
  userExtra: IUserExtra | null = null;

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
    private userExtraService: UserExtraService
  ) {}

  ngOnInit(): void {
    this.accountService.identity().subscribe(account => {
      if (account) {
        this.settingsForm.patchValue(account);
        this.userLogin = account.login;
        this.userExtraService.findByUserLogin(account.login).subscribe((res: HttpResponse<IUserExtra>) => {
          this.userExtra = res.body;
        });
      }
    });
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

      if (this.userExtra) {
        this.userExtra.pfp = this.settingsForm.get(['pfp'])?.value;
        this.userExtra.bio = this.settingsForm.get(['bio'])?.value;
        this.userExtraService.update(this.userExtra).subscribe();
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
