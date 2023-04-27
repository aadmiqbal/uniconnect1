import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';
import { switchMap } from 'rxjs/operators';

// Add a new parameter postFriendshipCallback to the greet function declaration
declare function greet(
  finalUser: any[] | undefined,
  currentUserId: number | undefined,
  postFriendshipCallback: (currentUserId: number, otherUserId: number) => Promise<void>
): void;

@Component({
  selector: 'jhi-connections-feed',
  templateUrl: './connections-feed.component.html',
  styleUrls: ['./connections-feed.component.scss'],
})
export class ConnectionsFeedComponent implements OnInit {
  constructor(private http: HttpClient) {}
  currentUserId: number | undefined;

  async ngOnInit(): Promise<void> {
    try {
      const account = await this.http.get<any>('/api/account').toPromise();
      this.currentUserId = account.id;
      const finalUser = await this.http.get<any[]>('/api/final-users').toPromise();
      greet(finalUser, this.currentUserId, this.postFriendship.bind(this));
    } catch (error) {
      console.error('Error fetching account or final users:', error);
    }
  }

  public async postFriendship(currentUserId: number, otherUserId: number): Promise<void> {
    console.log('current user: ', currentUserId);
    console.log('other user: ', otherUserId);

    const payload = {
      finalUser: { id: currentUserId },
      finalUser2: { id: otherUserId },
    };
    console.log('Payload:', payload); //

    try {
      await this.http.post<void>('/api/friendships', payload).toPromise();
      alert('Connection added successfully!');
    } catch (error) {
      console.error(error);
      alert('Failed to add connection');
    }
  }
}
