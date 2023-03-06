import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IModuleLink } from '../module-link.model';
import { ModuleLinkService } from '../service/module-link.service';

@Injectable({ providedIn: 'root' })
export class ModuleLinkRoutingResolveService implements Resolve<IModuleLink | null> {
  constructor(protected service: ModuleLinkService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IModuleLink | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((moduleLink: HttpResponse<IModuleLink>) => {
          if (moduleLink.body) {
            return of(moduleLink.body);
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
