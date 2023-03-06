import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IUserGroupAd, NewUserGroupAd } from '../user-group-ad.model';

export type PartialUpdateUserGroupAd = Partial<IUserGroupAd> & Pick<IUserGroupAd, 'id'>;

export type EntityResponseType = HttpResponse<IUserGroupAd>;
export type EntityArrayResponseType = HttpResponse<IUserGroupAd[]>;

@Injectable({ providedIn: 'root' })
export class UserGroupAdService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/user-group-ads');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(userGroupAd: NewUserGroupAd): Observable<EntityResponseType> {
    return this.http.post<IUserGroupAd>(this.resourceUrl, userGroupAd, { observe: 'response' });
  }

  update(userGroupAd: IUserGroupAd): Observable<EntityResponseType> {
    return this.http.put<IUserGroupAd>(`${this.resourceUrl}/${this.getUserGroupAdIdentifier(userGroupAd)}`, userGroupAd, {
      observe: 'response',
    });
  }

  partialUpdate(userGroupAd: PartialUpdateUserGroupAd): Observable<EntityResponseType> {
    return this.http.patch<IUserGroupAd>(`${this.resourceUrl}/${this.getUserGroupAdIdentifier(userGroupAd)}`, userGroupAd, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IUserGroupAd>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IUserGroupAd[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getUserGroupAdIdentifier(userGroupAd: Pick<IUserGroupAd, 'id'>): number {
    return userGroupAd.id;
  }

  compareUserGroupAd(o1: Pick<IUserGroupAd, 'id'> | null, o2: Pick<IUserGroupAd, 'id'> | null): boolean {
    return o1 && o2 ? this.getUserGroupAdIdentifier(o1) === this.getUserGroupAdIdentifier(o2) : o1 === o2;
  }

  addUserGroupAdToCollectionIfMissing<Type extends Pick<IUserGroupAd, 'id'>>(
    userGroupAdCollection: Type[],
    ...userGroupAdsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const userGroupAds: Type[] = userGroupAdsToCheck.filter(isPresent);
    if (userGroupAds.length > 0) {
      const userGroupAdCollectionIdentifiers = userGroupAdCollection.map(
        userGroupAdItem => this.getUserGroupAdIdentifier(userGroupAdItem)!
      );
      const userGroupAdsToAdd = userGroupAds.filter(userGroupAdItem => {
        const userGroupAdIdentifier = this.getUserGroupAdIdentifier(userGroupAdItem);
        if (userGroupAdCollectionIdentifiers.includes(userGroupAdIdentifier)) {
          return false;
        }
        userGroupAdCollectionIdentifiers.push(userGroupAdIdentifier);
        return true;
      });
      return [...userGroupAdsToAdd, ...userGroupAdCollection];
    }
    return userGroupAdCollection;
  }
}
