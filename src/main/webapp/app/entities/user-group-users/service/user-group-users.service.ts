import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IUserGroupUsers, NewUserGroupUsers } from '../user-group-users.model';

export type PartialUpdateUserGroupUsers = Partial<IUserGroupUsers> & Pick<IUserGroupUsers, 'id'>;

export type EntityResponseType = HttpResponse<IUserGroupUsers>;
export type EntityArrayResponseType = HttpResponse<IUserGroupUsers[]>;

@Injectable({ providedIn: 'root' })
export class UserGroupUsersService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/user-group-users');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(userGroupUsers: NewUserGroupUsers): Observable<EntityResponseType> {
    return this.http.post<IUserGroupUsers>(this.resourceUrl, userGroupUsers, { observe: 'response' });
  }

  update(userGroupUsers: IUserGroupUsers): Observable<EntityResponseType> {
    return this.http.put<IUserGroupUsers>(`${this.resourceUrl}/${this.getUserGroupUsersIdentifier(userGroupUsers)}`, userGroupUsers, {
      observe: 'response',
    });
  }

  partialUpdate(userGroupUsers: PartialUpdateUserGroupUsers): Observable<EntityResponseType> {
    return this.http.patch<IUserGroupUsers>(`${this.resourceUrl}/${this.getUserGroupUsersIdentifier(userGroupUsers)}`, userGroupUsers, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IUserGroupUsers>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IUserGroupUsers[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getUserGroupUsersIdentifier(userGroupUsers: Pick<IUserGroupUsers, 'id'>): number {
    return userGroupUsers.id;
  }

  compareUserGroupUsers(o1: Pick<IUserGroupUsers, 'id'> | null, o2: Pick<IUserGroupUsers, 'id'> | null): boolean {
    return o1 && o2 ? this.getUserGroupUsersIdentifier(o1) === this.getUserGroupUsersIdentifier(o2) : o1 === o2;
  }

  addUserGroupUsersToCollectionIfMissing<Type extends Pick<IUserGroupUsers, 'id'>>(
    userGroupUsersCollection: Type[],
    ...userGroupUsersToCheck: (Type | null | undefined)[]
  ): Type[] {
    const userGroupUsers: Type[] = userGroupUsersToCheck.filter(isPresent);
    if (userGroupUsers.length > 0) {
      const userGroupUsersCollectionIdentifiers = userGroupUsersCollection.map(
        userGroupUsersItem => this.getUserGroupUsersIdentifier(userGroupUsersItem)!
      );
      const userGroupUsersToAdd = userGroupUsers.filter(userGroupUsersItem => {
        const userGroupUsersIdentifier = this.getUserGroupUsersIdentifier(userGroupUsersItem);
        if (userGroupUsersCollectionIdentifiers.includes(userGroupUsersIdentifier)) {
          return false;
        }
        userGroupUsersCollectionIdentifiers.push(userGroupUsersIdentifier);
        return true;
      });
      return [...userGroupUsersToAdd, ...userGroupUsersCollection];
    }
    return userGroupUsersCollection;
  }
}
