import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IFinalGroup, NewFinalGroup } from '../final-group.model';

export type PartialUpdateFinalGroup = Partial<IFinalGroup> & Pick<IFinalGroup, 'id'>;

export type EntityResponseType = HttpResponse<IFinalGroup>;
export type EntityArrayResponseType = HttpResponse<IFinalGroup[]>;

@Injectable({ providedIn: 'root' })
export class FinalGroupService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/final-groups');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(finalGroup: NewFinalGroup): Observable<EntityResponseType> {
    return this.http.post<IFinalGroup>(this.resourceUrl, finalGroup, { observe: 'response' });
  }

  update(finalGroup: IFinalGroup): Observable<EntityResponseType> {
    return this.http.put<IFinalGroup>(`${this.resourceUrl}/${this.getFinalGroupIdentifier(finalGroup)}`, finalGroup, {
      observe: 'response',
    });
  }

  partialUpdate(finalGroup: PartialUpdateFinalGroup): Observable<EntityResponseType> {
    return this.http.patch<IFinalGroup>(`${this.resourceUrl}/${this.getFinalGroupIdentifier(finalGroup)}`, finalGroup, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IFinalGroup>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IFinalGroup[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getFinalGroupIdentifier(finalGroup: Pick<IFinalGroup, 'id'>): number {
    return finalGroup.id;
  }

  compareFinalGroup(o1: Pick<IFinalGroup, 'id'> | null, o2: Pick<IFinalGroup, 'id'> | null): boolean {
    return o1 && o2 ? this.getFinalGroupIdentifier(o1) === this.getFinalGroupIdentifier(o2) : o1 === o2;
  }

  addFinalGroupToCollectionIfMissing<Type extends Pick<IFinalGroup, 'id'>>(
    finalGroupCollection: Type[],
    ...finalGroupsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const finalGroups: Type[] = finalGroupsToCheck.filter(isPresent);
    if (finalGroups.length > 0) {
      const finalGroupCollectionIdentifiers = finalGroupCollection.map(finalGroupItem => this.getFinalGroupIdentifier(finalGroupItem)!);
      const finalGroupsToAdd = finalGroups.filter(finalGroupItem => {
        const finalGroupIdentifier = this.getFinalGroupIdentifier(finalGroupItem);
        if (finalGroupCollectionIdentifiers.includes(finalGroupIdentifier)) {
          return false;
        }
        finalGroupCollectionIdentifiers.push(finalGroupIdentifier);
        return true;
      });
      return [...finalGroupsToAdd, ...finalGroupCollection];
    }
    return finalGroupCollection;
  }
}
