import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IModuleLink, NewModuleLink } from '../module-link.model';

export type PartialUpdateModuleLink = Partial<IModuleLink> & Pick<IModuleLink, 'id'>;

export type EntityResponseType = HttpResponse<IModuleLink>;
export type EntityArrayResponseType = HttpResponse<IModuleLink[]>;

@Injectable({ providedIn: 'root' })
export class ModuleLinkService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/module-links');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(moduleLink: NewModuleLink): Observable<EntityResponseType> {
    return this.http.post<IModuleLink>(this.resourceUrl, moduleLink, { observe: 'response' });
  }

  update(moduleLink: IModuleLink): Observable<EntityResponseType> {
    return this.http.put<IModuleLink>(`${this.resourceUrl}/${this.getModuleLinkIdentifier(moduleLink)}`, moduleLink, {
      observe: 'response',
    });
  }

  partialUpdate(moduleLink: PartialUpdateModuleLink): Observable<EntityResponseType> {
    return this.http.patch<IModuleLink>(`${this.resourceUrl}/${this.getModuleLinkIdentifier(moduleLink)}`, moduleLink, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IModuleLink>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IModuleLink[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getModuleLinkIdentifier(moduleLink: Pick<IModuleLink, 'id'>): number {
    return moduleLink.id;
  }

  compareModuleLink(o1: Pick<IModuleLink, 'id'> | null, o2: Pick<IModuleLink, 'id'> | null): boolean {
    return o1 && o2 ? this.getModuleLinkIdentifier(o1) === this.getModuleLinkIdentifier(o2) : o1 === o2;
  }

  addModuleLinkToCollectionIfMissing<Type extends Pick<IModuleLink, 'id'>>(
    moduleLinkCollection: Type[],
    ...moduleLinksToCheck: (Type | null | undefined)[]
  ): Type[] {
    const moduleLinks: Type[] = moduleLinksToCheck.filter(isPresent);
    if (moduleLinks.length > 0) {
      const moduleLinkCollectionIdentifiers = moduleLinkCollection.map(moduleLinkItem => this.getModuleLinkIdentifier(moduleLinkItem)!);
      const moduleLinksToAdd = moduleLinks.filter(moduleLinkItem => {
        const moduleLinkIdentifier = this.getModuleLinkIdentifier(moduleLinkItem);
        if (moduleLinkCollectionIdentifiers.includes(moduleLinkIdentifier)) {
          return false;
        }
        moduleLinkCollectionIdentifiers.push(moduleLinkIdentifier);
        return true;
      });
      return [...moduleLinksToAdd, ...moduleLinkCollection];
    }
    return moduleLinkCollection;
  }
}
