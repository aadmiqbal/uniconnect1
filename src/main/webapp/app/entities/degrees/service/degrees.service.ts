import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IDegrees, NewDegrees } from '../degrees.model';

export type PartialUpdateDegrees = Partial<IDegrees> & Pick<IDegrees, 'id'>;

export type EntityResponseType = HttpResponse<IDegrees>;
export type EntityArrayResponseType = HttpResponse<IDegrees[]>;

@Injectable({ providedIn: 'root' })
export class DegreesService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/degrees');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(degrees: NewDegrees): Observable<EntityResponseType> {
    return this.http.post<IDegrees>(this.resourceUrl, degrees, { observe: 'response' });
  }

  update(degrees: IDegrees): Observable<EntityResponseType> {
    return this.http.put<IDegrees>(`${this.resourceUrl}/${this.getDegreesIdentifier(degrees)}`, degrees, { observe: 'response' });
  }

  partialUpdate(degrees: PartialUpdateDegrees): Observable<EntityResponseType> {
    return this.http.patch<IDegrees>(`${this.resourceUrl}/${this.getDegreesIdentifier(degrees)}`, degrees, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IDegrees>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IDegrees[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getDegreesIdentifier(degrees: Pick<IDegrees, 'id'>): number {
    return degrees.id;
  }

  compareDegrees(o1: Pick<IDegrees, 'id'> | null, o2: Pick<IDegrees, 'id'> | null): boolean {
    return o1 && o2 ? this.getDegreesIdentifier(o1) === this.getDegreesIdentifier(o2) : o1 === o2;
  }

  addDegreesToCollectionIfMissing<Type extends Pick<IDegrees, 'id'>>(
    degreesCollection: Type[],
    ...degreesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const degrees: Type[] = degreesToCheck.filter(isPresent);
    if (degrees.length > 0) {
      const degreesCollectionIdentifiers = degreesCollection.map(degreesItem => this.getDegreesIdentifier(degreesItem)!);
      const degreesToAdd = degrees.filter(degreesItem => {
        const degreesIdentifier = this.getDegreesIdentifier(degreesItem);
        if (degreesCollectionIdentifiers.includes(degreesIdentifier)) {
          return false;
        }
        degreesCollectionIdentifiers.push(degreesIdentifier);
        return true;
      });
      return [...degreesToAdd, ...degreesCollection];
    }
    return degreesCollection;
  }
}
