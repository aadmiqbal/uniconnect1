import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IUserGroupAd } from '../user-group-ad.model';
import { UserGroupAdService } from '../service/user-group-ad.service';

@Injectable({ providedIn: 'root' })
export class UserGroupAdRoutingResolveService implements Resolve<IUserGroupAd | null> {
  constructor(protected service: UserGroupAdService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IUserGroupAd | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((userGroupAd: HttpResponse<IUserGroupAd>) => {
          if (userGroupAd.body) {
            return of(userGroupAd.body);
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
