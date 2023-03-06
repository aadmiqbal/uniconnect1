import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IUserGroups, NewUserGroups } from '../user-groups.model';

export type PartialUpdateUserGroups = Partial<IUserGroups> & Pick<IUserGroups, 'id'>;

export type EntityResponseType = HttpResponse<IUserGroups>;
export type EntityArrayResponseType = HttpResponse<IUserGroups[]>;

@Injectable({ providedIn: 'root' })
export class UserGroupsService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/user-groups');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(userGroups: NewUserGroups): Observable<EntityResponseType> {
    return this.http.post<IUserGroups>(this.resourceUrl, userGroups, { observe: 'response' });
  }

  update(userGroups: IUserGroups): Observable<EntityResponseType> {
    return this.http.put<IUserGroups>(`${this.resourceUrl}/${this.getUserGroupsIdentifier(userGroups)}`, userGroups, {
      observe: 'response',
    });
  }

  partialUpdate(userGroups: PartialUpdateUserGroups): Observable<EntityResponseType> {
    return this.http.patch<IUserGroups>(`${this.resourceUrl}/${this.getUserGroupsIdentifier(userGroups)}`, userGroups, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IUserGroups>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IUserGroups[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getUserGroupsIdentifier(userGroups: Pick<IUserGroups, 'id'>): number {
    return userGroups.id;
  }

  compareUserGroups(o1: Pick<IUserGroups, 'id'> | null, o2: Pick<IUserGroups, 'id'> | null): boolean {
    return o1 && o2 ? this.getUserGroupsIdentifier(o1) === this.getUserGroupsIdentifier(o2) : o1 === o2;
  }

  addUserGroupsToCollectionIfMissing<Type extends Pick<IUserGroups, 'id'>>(
    userGroupsCollection: Type[],
    ...userGroupsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const userGroups: Type[] = userGroupsToCheck.filter(isPresent);
    if (userGroups.length > 0) {
      const userGroupsCollectionIdentifiers = userGroupsCollection.map(userGroupsItem => this.getUserGroupsIdentifier(userGroupsItem)!);
      const userGroupsToAdd = userGroups.filter(userGroupsItem => {
        const userGroupsIdentifier = this.getUserGroupsIdentifier(userGroupsItem);
        if (userGroupsCollectionIdentifiers.includes(userGroupsIdentifier)) {
          return false;
        }
        userGroupsCollectionIdentifiers.push(userGroupsIdentifier);
        return true;
      });
      return [...userGroupsToAdd, ...userGroupsCollection];
    }
    return userGroupsCollection;
  }
}
