import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IUserModules } from '../user-modules.model';
import { UserModulesService } from '../service/user-modules.service';

@Injectable({ providedIn: 'root' })
export class UserModulesRoutingResolveService implements Resolve<IUserModules | null> {
  constructor(protected service: UserModulesService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IUserModules | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((userModules: HttpResponse<IUserModules>) => {
          if (userModules.body) {
            return of(userModules.body);
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
