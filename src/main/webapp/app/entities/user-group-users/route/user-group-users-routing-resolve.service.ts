import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IUserGroupUsers } from '../user-group-users.model';
import { UserGroupUsersService } from '../service/user-group-users.service';

@Injectable({ providedIn: 'root' })
export class UserGroupUsersRoutingResolveService implements Resolve<IUserGroupUsers | null> {
  constructor(protected service: UserGroupUsersService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IUserGroupUsers | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((userGroupUsers: HttpResponse<IUserGroupUsers>) => {
          if (userGroupUsers.body) {
            return of(userGroupUsers.body);
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
