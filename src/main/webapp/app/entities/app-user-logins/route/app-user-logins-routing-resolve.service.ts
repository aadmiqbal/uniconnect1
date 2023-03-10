import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IAppUserLogins } from '../app-user-logins.model';
import { AppUserLoginsService } from '../service/app-user-logins.service';

@Injectable({ providedIn: 'root' })
export class AppUserLoginsRoutingResolveService implements Resolve<IAppUserLogins | null> {
  constructor(protected service: AppUserLoginsService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IAppUserLogins | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((appUserLogins: HttpResponse<IAppUserLogins>) => {
          if (appUserLogins.body) {
            return of(appUserLogins.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(null);
  }
}
