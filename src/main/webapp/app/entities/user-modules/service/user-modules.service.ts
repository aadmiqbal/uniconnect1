import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IUserModules, NewUserModules } from '../user-modules.model';

export type PartialUpdateUserModules = Partial<IUserModules> & Pick<IUserModules, 'id'>;

export type EntityResponseType = HttpResponse<IUserModules>;
export type EntityArrayResponseType = HttpResponse<IUserModules[]>;

@Injectable({ providedIn: 'root' })
export class UserModulesService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/user-modules');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(userModules: NewUserModules): Observable<EntityResponseType> {
    return this.http.post<IUserModules>(this.resourceUrl, userModules, { observe: 'response' });
  }

  update(userModules: IUserModules): Observable<EntityResponseType> {
    return this.http.put<IUserModules>(`${this.resourceUrl}/${this.getUserModulesIdentifier(userModules)}`, userModules, {
      observe: 'response',
    });
  }

  partialUpdate(userModules: PartialUpdateUserModules): Observable<EntityResponseType> {
    return this.http.patch<IUserModules>(`${this.resourceUrl}/${this.getUserModulesIdentifier(userModules)}`, userModules, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IUserModules>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IUserModules[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getUserModulesIdentifier(userModules: Pick<IUserModules, 'id'>): number {
    return userModules.id;
  }

  compareUserModules(o1: Pick<IUserModules, 'id'> | null, o2: Pick<IUserModules, 'id'> | null): boolean {
    return o1 && o2 ? this.getUserModulesIdentifier(o1) === this.getUserModulesIdentifier(o2) : o1 === o2;
  }

  addUserModulesToCollectionIfMissing<Type extends Pick<IUserModules, 'id'>>(
    userModulesCollection: Type[],
    ...userModulesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const userModules: Type[] = userModulesToCheck.filter(isPresent);
    if (userModules.length > 0) {
      const userModulesCollectionIdentifiers = userModulesCollection.map(
        userModulesItem => this.getUserModulesIdentifier(userModulesItem)!
      );
      const userModulesToAdd = userModules.filter(userModulesItem => {
        const userModulesIdentifier = this.getUserModulesIdentifier(userModulesItem);
        if (userModulesCollectionIdentifiers.includes(userModulesIdentifier)) {
          return false;
        }
        userModulesCollectionIdentifiers.push(userModulesIdentifier);
        return true;
      });
      return [...userModulesToAdd, ...userModulesCollection];
    }
    return userModulesCollection;
  }
}
