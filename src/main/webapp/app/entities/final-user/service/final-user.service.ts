import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IFinalUser, NewFinalUser } from '../final-user.model';

export type PartialUpdateFinalUser = Partial<IFinalUser> & Pick<IFinalUser, 'id'>;

export type EntityResponseType = HttpResponse<IFinalUser>;
export type EntityArrayResponseType = HttpResponse<IFinalUser[]>;

@Injectable({ providedIn: 'root' })
export class FinalUserService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/final-users');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(finalUser: NewFinalUser): Observable<EntityResponseType> {
    return this.http.post<IFinalUser>(this.resourceUrl, finalUser, { observe: 'response' });
  }

  update(finalUser: IFinalUser): Observable<EntityResponseType> {
    return this.http.put<IFinalUser>(`${this.resourceUrl}/${this.getFinalUserIdentifier(finalUser)}`, finalUser, { observe: 'response' });
  }

  partialUpdate(finalUser: PartialUpdateFinalUser): Observable<EntityResponseType> {
    return this.http.patch<IFinalUser>(`${this.resourceUrl}/${this.getFinalUserIdentifier(finalUser)}`, finalUser, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IFinalUser>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IFinalUser[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getFinalUserIdentifier(finalUser: Pick<IFinalUser, 'id'>): number {
    return finalUser.id;
  }

  compareFinalUser(o1: Pick<IFinalUser, 'id'> | null, o2: Pick<IFinalUser, 'id'> | null): boolean {
    return o1 && o2 ? this.getFinalUserIdentifier(o1) === this.getFinalUserIdentifier(o2) : o1 === o2;
  }

  addFinalUserToCollectionIfMissing<Type extends Pick<IFinalUser, 'id'>>(
    finalUserCollection: Type[],
    ...finalUsersToCheck: (Type | null | undefined)[]
  ): Type[] {
    const finalUsers: Type[] = finalUsersToCheck.filter(isPresent);
    if (finalUsers.length > 0) {
      const finalUserCollectionIdentifiers = finalUserCollection.map(finalUserItem => this.getFinalUserIdentifier(finalUserItem)!);
      const finalUsersToAdd = finalUsers.filter(finalUserItem => {
        const finalUserIdentifier = this.getFinalUserIdentifier(finalUserItem);
        if (finalUserCollectionIdentifiers.includes(finalUserIdentifier)) {
          return false;
        }
        finalUserCollectionIdentifiers.push(finalUserIdentifier);
        return true;
      });
      return [...finalUsersToAdd, ...finalUserCollection];
    }
    return finalUserCollection;
  }

  findByUserLogin(userLogin: string): Observable<EntityResponseType> {
    return this.http.get<IFinalUser>(`${this.resourceUrl}/by-user-login/${userLogin}`, { observe: 'response' });
  }
}
