import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IMentorLink } from '../mentor-link.model';
import { MentorLinkService } from '../service/mentor-link.service';

@Injectable({ providedIn: 'root' })
export class MentorLinkRoutingResolveService implements Resolve<IMentorLink | null> {
  constructor(protected service: MentorLinkService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IMentorLink | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((mentorLink: HttpResponse<IMentorLink>) => {
          if (mentorLink.body) {
            return of(mentorLink.body);
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
