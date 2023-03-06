import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAppUsers, NewAppUsers } from '../app-users.model';

export type PartialUpdateAppUsers = Partial<IAppUsers> & Pick<IAppUsers, 'id'>;

export type EntityResponseType = HttpResponse<IAppUsers>;
export type EntityArrayResponseType = HttpResponse<IAppUsers[]>;

@Injectable({ providedIn: 'root' })
export class AppUsersService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/app-users');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(appUsers: NewAppUsers): Observable<EntityResponseType> {
    return this.http.post<IAppUsers>(this.resourceUrl, appUsers, { observe: 'response' });
  }

  update(appUsers: IAppUsers): Observable<EntityResponseType> {
    return this.http.put<IAppUsers>(`${this.resourceUrl}/${this.getAppUsersIdentifier(appUsers)}`, appUsers, { observe: 'response' });
  }

  partialUpdate(appUsers: PartialUpdateAppUsers): Observable<EntityResponseType> {
    return this.http.patch<IAppUsers>(`${this.resourceUrl}/${this.getAppUsersIdentifier(appUsers)}`, appUsers, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IAppUsers>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IAppUsers[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getAppUsersIdentifier(appUsers: Pick<IAppUsers, 'id'>): number {
    return appUsers.id;
  }

  compareAppUsers(o1: Pick<IAppUsers, 'id'> | null, o2: Pick<IAppUsers, 'id'> | null): boolean {
    return o1 && o2 ? this.getAppUsersIdentifier(o1) === this.getAppUsersIdentifier(o2) : o1 === o2;
  }

  addAppUsersToCollectionIfMissing<Type extends Pick<IAppUsers, 'id'>>(
    appUsersCollection: Type[],
    ...appUsersToCheck: (Type | null | undefined)[]
  ): Type[] {
    const appUsers: Type[] = appUsersToCheck.filter(isPresent);
    if (appUsers.length > 0) {
      const appUsersCollectionIdentifiers = appUsersCollection.map(appUsersItem => this.getAppUsersIdentifier(appUsersItem)!);
      const appUsersToAdd = appUsers.filter(appUsersItem => {
        const appUsersIdentifier = this.getAppUsersIdentifier(appUsersItem);
        if (appUsersCollectionIdentifiers.includes(appUsersIdentifier)) {
          return false;
        }
        appUsersCollectionIdentifiers.push(appUsersIdentifier);
        return true;
      });
      return [...appUsersToAdd, ...appUsersCollection];
    }
    return appUsersCollection;
  }
}
