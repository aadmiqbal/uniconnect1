import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IDegreeSubjects } from '../degree-subjects.model';
import { DegreeSubjectsService } from '../service/degree-subjects.service';

@Injectable({ providedIn: 'root' })
export class DegreeSubjectsRoutingResolveService implements Resolve<IDegreeSubjects | null> {
  constructor(protected service: DegreeSubjectsService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IDegreeSubjects | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((degreeSubjects: HttpResponse<IDegreeSubjects>) => {
          if (degreeSubjects.body) {
            return of(degreeSubjects.body);
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
