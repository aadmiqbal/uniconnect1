import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { forkJoin, Observable } from 'rxjs';
import { switchMap, tap, map } from 'rxjs/operators';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { Registration } from './register.model';

@Injectable({ providedIn: 'root' })
export class RegisterService {
  constructor(private http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  save(account: any, studyYear: string, bio: string /*, modules: any[] */): Observable<HttpResponse<any>> {
    //TODO: modules stuff
    const data = {
      ...account,
      studyYear,
      bio,
      //modules,
    };

    return this.http.post<any>(SERVER_API_URL + 'api/register', data, { observe: 'response' });
  }
}
