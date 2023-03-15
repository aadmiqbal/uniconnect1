import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { Registration } from './register.model';

@Injectable({ providedIn: 'root' })
export class RegisterService {
  constructor(private http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  save(registration: Registration, studyYear: string, bio: string, module: string): Observable<{}> {
    this.http.put('/api/app-users-logins', { login: registration.login, passwordHash: registration.password }).subscribe();
    this.http.post('/api/app-users', { name: registration.login, studyYear: studyYear, bio: bio }).subscribe();
    this.http.get('/api/app-users').subscribe(usersDetails => {
      const user = (usersDetails as any[]).find(user => user.username === registration.login);
      const userId = user ? user.id : null;
      this.http.get<any[]>('/api/user-modules').subscribe(modules => {
        this.http.post('api/module-links', { userId: userId, module: module }).subscribe();
      });
    });

    return this.http.post(this.applicationConfigService.getEndpointFor('api/register'), registration).pipe();
  }
}
