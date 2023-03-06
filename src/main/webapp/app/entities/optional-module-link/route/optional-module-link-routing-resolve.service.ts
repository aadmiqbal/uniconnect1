import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IOptionalModuleLink } from '../optional-module-link.model';
import { OptionalModuleLinkService } from '../service/optional-module-link.service';

@Injectable({ providedIn: 'root' })
export class OptionalModuleLinkRoutingResolveService implements Resolve<IOptionalModuleLink | null> {
  constructor(protected service: OptionalModuleLinkService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IOptionalModuleLink | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((optionalModuleLink: HttpResponse<IOptionalModuleLink>) => {
          if (optionalModuleLink.body) {
            return of(optionalModuleLink.body);
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
