import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IMentees } from '../mentees.model';
import { MenteesService } from '../service/mentees.service';

@Injectable({ providedIn: 'root' })
export class MenteesRoutingResolveService implements Resolve<IMentees | null> {
  constructor(protected service: MenteesService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IMentees | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((mentees: HttpResponse<IMentees>) => {
          if (mentees.body) {
            return of(mentees.body);
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
