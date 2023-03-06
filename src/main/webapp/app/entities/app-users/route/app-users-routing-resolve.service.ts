import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IAppUsers } from '../app-users.model';
import { AppUsersService } from '../service/app-users.service';

@Injectable({ providedIn: 'root' })
export class AppUsersRoutingResolveService implements Resolve<IAppUsers | null> {
  constructor(protected service: AppUsersService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IAppUsers | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((appUsers: HttpResponse<IAppUsers>) => {
          if (appUsers.body) {
            return of(appUsers.body);
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
