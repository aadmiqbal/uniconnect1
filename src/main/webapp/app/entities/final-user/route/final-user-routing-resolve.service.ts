import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IFinalUser } from '../final-user.model';
import { FinalUserService } from '../service/final-user.service';

@Injectable({ providedIn: 'root' })
export class FinalUserRoutingResolveService implements Resolve<IFinalUser | null> {
  constructor(protected service: FinalUserService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IFinalUser | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((finalUser: HttpResponse<IFinalUser>) => {
          if (finalUser.body) {
            return of(finalUser.body);
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
