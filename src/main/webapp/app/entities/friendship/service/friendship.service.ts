import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IFriendship, NewFriendship } from '../friendship.model';

export type PartialUpdateFriendship = Partial<IFriendship> & Pick<IFriendship, 'id'>;

export type EntityResponseType = HttpResponse<IFriendship>;
export type EntityArrayResponseType = HttpResponse<IFriendship[]>;

@Injectable({ providedIn: 'root' })
export class FriendshipService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/friendships');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(friendship: NewFriendship): Observable<EntityResponseType> {
    return this.http.post<IFriendship>(this.resourceUrl, friendship, { observe: 'response' });
  }

  update(friendship: IFriendship): Observable<EntityResponseType> {
    return this.http.put<IFriendship>(`${this.resourceUrl}/${this.getFriendshipIdentifier(friendship)}`, friendship, {
      observe: 'response',
    });
  }

  partialUpdate(friendship: PartialUpdateFriendship): Observable<EntityResponseType> {
    return this.http.patch<IFriendship>(`${this.resourceUrl}/${this.getFriendshipIdentifier(friendship)}`, friendship, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IFriendship>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IFriendship[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getFriendshipIdentifier(friendship: Pick<IFriendship, 'id'>): number {
    return friendship.id;
  }

  compareFriendship(o1: Pick<IFriendship, 'id'> | null, o2: Pick<IFriendship, 'id'> | null): boolean {
    return o1 && o2 ? this.getFriendshipIdentifier(o1) === this.getFriendshipIdentifier(o2) : o1 === o2;
  }

  addFriendshipToCollectionIfMissing<Type extends Pick<IFriendship, 'id'>>(
    friendshipCollection: Type[],
    ...friendshipsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const friendships: Type[] = friendshipsToCheck.filter(isPresent);
    if (friendships.length > 0) {
      const friendshipCollectionIdentifiers = friendshipCollection.map(friendshipItem => this.getFriendshipIdentifier(friendshipItem)!);
      const friendshipsToAdd = friendships.filter(friendshipItem => {
        const friendshipIdentifier = this.getFriendshipIdentifier(friendshipItem);
        if (friendshipCollectionIdentifiers.includes(friendshipIdentifier)) {
          return false;
        }
        friendshipCollectionIdentifiers.push(friendshipIdentifier);
        return true;
      });
      return [...friendshipsToAdd, ...friendshipCollection];
    }
    return friendshipCollection;
  }
}
