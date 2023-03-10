import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAppUserLogins, NewAppUserLogins } from '../app-user-logins.model';

export type PartialUpdateAppUserLogins = Partial<IAppUserLogins> & Pick<IAppUserLogins, 'id'>;

export type EntityResponseType = HttpResponse<IAppUserLogins>;
export type EntityArrayResponseType = HttpResponse<IAppUserLogins[]>;

@Injectable({ providedIn: 'root' })
export class AppUserLoginsService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/app-user-logins');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(appUserLogins: NewAppUserLogins): Observable<EntityResponseType> {
    return this.http.post<IAppUserLogins>(this.resourceUrl, appUserLogins, { observe: 'response' });
  }

  update(appUserLogins: IAppUserLogins): Observable<EntityResponseType> {
    return this.http.put<IAppUserLogins>(`${this.resourceUrl}/${this.getAppUserLoginsIdentifier(appUserLogins)}`, appUserLogins, {
      observe: 'response',
    });
  }

  partialUpdate(appUserLogins: PartialUpdateAppUserLogins): Observable<EntityResponseType> {
    return this.http.patch<IAppUserLogins>(`${this.resourceUrl}/${this.getAppUserLoginsIdentifier(appUserLogins)}`, appUserLogins, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IAppUserLogins>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IAppUserLogins[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getAppUserLoginsIdentifier(appUserLogins: Pick<IAppUserLogins, 'id'>): number {
    return appUserLogins.id;
  }

  compareAppUserLogins(o1: Pick<IAppUserLogins, 'id'> | null, o2: Pick<IAppUserLogins, 'id'> | null): boolean {
    return o1 && o2 ? this.getAppUserLoginsIdentifier(o1) === this.getAppUserLoginsIdentifier(o2) : o1 === o2;
  }

  addAppUserLoginsToCollectionIfMissing<Type extends Pick<IAppUserLogins, 'id'>>(
    appUserLoginsCollection: Type[],
    ...appUserLoginsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const appUserLogins: Type[] = appUserLoginsToCheck.filter(isPresent);
    if (appUserLogins.length > 0) {
      const appUserLoginsCollectionIdentifiers = appUserLoginsCollection.map(
        appUserLoginsItem => this.getAppUserLoginsIdentifier(appUserLoginsItem)!
      );
      const appUserLoginsToAdd = appUserLogins.filter(appUserLoginsItem => {
        const appUserLoginsIdentifier = this.getAppUserLoginsIdentifier(appUserLoginsItem);
        if (appUserLoginsCollectionIdentifiers.includes(appUserLoginsIdentifier)) {
          return false;
        }
        appUserLoginsCollectionIdentifiers.push(appUserLoginsIdentifier);
        return true;
      });
      return [...appUserLoginsToAdd, ...appUserLoginsCollection];
    }
    return appUserLoginsCollection;
  }
}
