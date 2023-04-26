import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IFriendship } from '../friendship.model';
import { FriendshipService } from '../service/friendship.service';

@Injectable({ providedIn: 'root' })
export class FriendshipRoutingResolveService implements Resolve<IFriendship | null> {
  constructor(protected service: FriendshipService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IFriendship | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((friendship: HttpResponse<IFriendship>) => {
          if (friendship.body) {
            return of(friendship.body);
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
