import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IOptionalModuleLink, NewOptionalModuleLink } from '../optional-module-link.model';

export type PartialUpdateOptionalModuleLink = Partial<IOptionalModuleLink> & Pick<IOptionalModuleLink, 'id'>;

export type EntityResponseType = HttpResponse<IOptionalModuleLink>;
export type EntityArrayResponseType = HttpResponse<IOptionalModuleLink[]>;

@Injectable({ providedIn: 'root' })
export class OptionalModuleLinkService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/optional-module-links');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(optionalModuleLink: NewOptionalModuleLink): Observable<EntityResponseType> {
    return this.http.post<IOptionalModuleLink>(this.resourceUrl, optionalModuleLink, { observe: 'response' });
  }

  update(optionalModuleLink: IOptionalModuleLink): Observable<EntityResponseType> {
    return this.http.put<IOptionalModuleLink>(
      `${this.resourceUrl}/${this.getOptionalModuleLinkIdentifier(optionalModuleLink)}`,
      optionalModuleLink,
      { observe: 'response' }
    );
  }

  partialUpdate(optionalModuleLink: PartialUpdateOptionalModuleLink): Observable<EntityResponseType> {
    return this.http.patch<IOptionalModuleLink>(
      `${this.resourceUrl}/${this.getOptionalModuleLinkIdentifier(optionalModuleLink)}`,
      optionalModuleLink,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IOptionalModuleLink>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IOptionalModuleLink[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getOptionalModuleLinkIdentifier(optionalModuleLink: Pick<IOptionalModuleLink, 'id'>): number {
    return optionalModuleLink.id;
  }

  compareOptionalModuleLink(o1: Pick<IOptionalModuleLink, 'id'> | null, o2: Pick<IOptionalModuleLink, 'id'> | null): boolean {
    return o1 && o2 ? this.getOptionalModuleLinkIdentifier(o1) === this.getOptionalModuleLinkIdentifier(o2) : o1 === o2;
  }

  addOptionalModuleLinkToCollectionIfMissing<Type extends Pick<IOptionalModuleLink, 'id'>>(
    optionalModuleLinkCollection: Type[],
    ...optionalModuleLinksToCheck: (Type | null | undefined)[]
  ): Type[] {
    const optionalModuleLinks: Type[] = optionalModuleLinksToCheck.filter(isPresent);
    if (optionalModuleLinks.length > 0) {
      const optionalModuleLinkCollectionIdentifiers = optionalModuleLinkCollection.map(
        optionalModuleLinkItem => this.getOptionalModuleLinkIdentifier(optionalModuleLinkItem)!
      );
      const optionalModuleLinksToAdd = optionalModuleLinks.filter(optionalModuleLinkItem => {
        const optionalModuleLinkIdentifier = this.getOptionalModuleLinkIdentifier(optionalModuleLinkItem);
        if (optionalModuleLinkCollectionIdentifiers.includes(optionalModuleLinkIdentifier)) {
          return false;
        }
        optionalModuleLinkCollectionIdentifiers.push(optionalModuleLinkIdentifier);
        return true;
      });
      return [...optionalModuleLinksToAdd, ...optionalModuleLinkCollection];
    }
    return optionalModuleLinkCollection;
  }
}
