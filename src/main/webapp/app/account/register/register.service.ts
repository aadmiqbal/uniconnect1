import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable } from 'rxjs';
import { switchMap, tap, map } from 'rxjs/operators';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { Registration } from './register.model';

@Injectable({ providedIn: 'root' })
export class RegisterService {
  constructor(private http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  save(registration: Registration, studyYear: string, bio: string, module: string): Observable<{}> {
    const yearNumber = parseInt(studyYear.match(/\d+/)?.[0] || '0', 10);
    return this.http.post(this.applicationConfigService.getEndpointFor('api/register'), registration).pipe(
      /* switchMap(() => {
        return forkJoin({
          //TODO: Password hash and salt stuff if we keep this table
          //userLogin: this.http.post('/api/app-user-logins', { login: registration.login, passwordHash: registration.password }),
          user: this.http.post('/api/app-users', { name: registration.login, studyYear: yearNumber, bio: bio }),
        });
      }), */
      switchMap(() => {
        return this.http.post('/api/app-users', { name: registration.login, studyYear: yearNumber, bio: bio }).pipe(
          map(user => {
            return { user };
          })
        );
      }),
      switchMap(({ user }) => {
        return this.http.get<any[]>('/api/user-modules').pipe(
          map(modules => {
            return { user: user as { id: number }, modules };
          })
        );
      }),
      switchMap(({ user, modules }) => {
        //TODO: fix whatever gets posted to module links
        const userId = user ? user.id : null;
        return this.http.post('api/module-links', { userId: userId, module: module });
      })
    );
  }
}
