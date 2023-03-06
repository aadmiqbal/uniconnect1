import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IConnections } from '../connections.model';
import { ConnectionsService } from '../service/connections.service';

@Injectable({ providedIn: 'root' })
export class ConnectionsRoutingResolveService implements Resolve<IConnections | null> {
  constructor(protected service: ConnectionsService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IConnections | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((connections: HttpResponse<IConnections>) => {
          if (connections.body) {
            return of(connections.body);
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
