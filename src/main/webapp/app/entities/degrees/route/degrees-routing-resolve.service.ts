import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IDegrees } from '../degrees.model';
import { DegreesService } from '../service/degrees.service';

@Injectable({ providedIn: 'root' })
export class DegreesRoutingResolveService implements Resolve<IDegrees | null> {
  constructor(protected service: DegreesService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IDegrees | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((degrees: HttpResponse<IDegrees>) => {
          if (degrees.body) {
            return of(degrees.body);
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
