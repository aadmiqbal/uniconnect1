import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IUserGroups } from '../user-groups.model';
import { UserGroupsService } from '../service/user-groups.service';

@Injectable({ providedIn: 'root' })
export class UserGroupsRoutingResolveService implements Resolve<IUserGroups | null> {
  constructor(protected service: UserGroupsService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IUserGroups | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((userGroups: HttpResponse<IUserGroups>) => {
          if (userGroups.body) {
            return of(userGroups.body);
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
