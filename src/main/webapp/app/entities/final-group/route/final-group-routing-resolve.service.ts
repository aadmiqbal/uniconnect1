import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IFinalGroup } from '../final-group.model';
import { FinalGroupService } from '../service/final-group.service';

@Injectable({ providedIn: 'root' })
export class FinalGroupRoutingResolveService implements Resolve<IFinalGroup | null> {
  constructor(protected service: FinalGroupService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IFinalGroup | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((finalGroup: HttpResponse<IFinalGroup>) => {
          if (finalGroup.body) {
            return of(finalGroup.body);
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
