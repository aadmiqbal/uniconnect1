import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IConnections, NewConnections } from '../connections.model';

export type PartialUpdateConnections = Partial<IConnections> & Pick<IConnections, 'id'>;

export type EntityResponseType = HttpResponse<IConnections>;
export type EntityArrayResponseType = HttpResponse<IConnections[]>;

@Injectable({ providedIn: 'root' })
export class ConnectionsService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/connections');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(connections: NewConnections): Observable<EntityResponseType> {
    return this.http.post<IConnections>(this.resourceUrl, connections, { observe: 'response' });
  }

  update(connections: IConnections): Observable<EntityResponseType> {
    return this.http.put<IConnections>(`${this.resourceUrl}/${this.getConnectionsIdentifier(connections)}`, connections, {
      observe: 'response',
    });
  }

  partialUpdate(connections: PartialUpdateConnections): Observable<EntityResponseType> {
    return this.http.patch<IConnections>(`${this.resourceUrl}/${this.getConnectionsIdentifier(connections)}`, connections, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IConnections>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IConnections[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getConnectionsIdentifier(connections: Pick<IConnections, 'id'>): number {
    return connections.id;
  }

  compareConnections(o1: Pick<IConnections, 'id'> | null, o2: Pick<IConnections, 'id'> | null): boolean {
    return o1 && o2 ? this.getConnectionsIdentifier(o1) === this.getConnectionsIdentifier(o2) : o1 === o2;
  }

  addConnectionsToCollectionIfMissing<Type extends Pick<IConnections, 'id'>>(
    connectionsCollection: Type[],
    ...connectionsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const connections: Type[] = connectionsToCheck.filter(isPresent);
    if (connections.length > 0) {
      const connectionsCollectionIdentifiers = connectionsCollection.map(
        connectionsItem => this.getConnectionsIdentifier(connectionsItem)!
      );
      const connectionsToAdd = connections.filter(connectionsItem => {
        const connectionsIdentifier = this.getConnectionsIdentifier(connectionsItem);
        if (connectionsCollectionIdentifiers.includes(connectionsIdentifier)) {
          return false;
        }
        connectionsCollectionIdentifiers.push(connectionsIdentifier);
        return true;
      });
      return [...connectionsToAdd, ...connectionsCollection];
    }
    return connectionsCollection;
  }
}
