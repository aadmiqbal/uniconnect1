import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IMentors } from '../mentors.model';
import { MentorsService } from '../service/mentors.service';

@Injectable({ providedIn: 'root' })
export class MentorsRoutingResolveService implements Resolve<IMentors | null> {
  constructor(protected service: MentorsService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IMentors | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((mentors: HttpResponse<IMentors>) => {
          if (mentors.body) {
            return of(mentors.body);
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
