import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IUserExtra } from '../user-extra.model';
import { UserExtraService } from '../service/user-extra.service';

@Injectable({ providedIn: 'root' })
export class UserExtraRoutingResolveService implements Resolve<IUserExtra | null> {
  constructor(protected service: UserExtraService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IUserExtra | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((userExtra: HttpResponse<IUserExtra>) => {
          if (userExtra.body) {
            return of(userExtra.body);
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
