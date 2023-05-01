import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

declare function greet(
  finalUser: any[] | undefined,
  currentUserId: number | undefined,
  postFriendshipCallback: (currentUserId: number, otherUserId: number) => Promise<void>,
  currentFriendships: any[] | undefined,
  isMentorSelected: boolean
): void;

@Component({
  selector: 'jhi-connections-feed',
  templateUrl: './connections-feed.component.html',
  styleUrls: ['./connections-feed.component.scss'],
})
export class ConnectionsFeedComponent implements OnInit {
  constructor(private http: HttpClient) {}

  currentUserId: number | undefined;
  isMentorSelected = false;
  allUsers: any[] = [];
  mentorUsers: any[] = [];

  async ngOnInit(): Promise<void> {
    try {
      const account = await this.http.get<any>('/api/account').toPromise();
      this.currentUserId = account.id;
      const currentFriendships = await this.getFriendshipsForCurrentUser();

      this.allUsers = (await this.http.get<any[]>('/api/final-users').toPromise()) || [];

      this.mentorUsers = this.allUsers.filter(user => user.modules && user.modules.includes('isMentor'));

      greet(this.getMentorUsersToDisplay(), this.currentUserId, this.postFriendship.bind(this), currentFriendships, this.isMentorSelected);
    } catch (error) {
      console.error('Error fetching account or final users:', error);
    }
  }

  async toggleMentorFilter(): Promise<void> {
    this.isMentorSelected = !this.isMentorSelected;
    const currentFriendships = await this.getFriendshipsForCurrentUser();
    greet(this.allUsers, this.currentUserId, this.postFriendship.bind(this), currentFriendships, this.isMentorSelected);
  }

  private getMentorUsersToDisplay(): any[] {
    return this.isMentorSelected ? this.mentorUsers : this.allUsers;
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
      window.location.reload();
    } catch (error) {
      console.error(error);
      alert('Failed to add connection');
    }
  }

  async getFriendshipsForCurrentUser(): Promise<any[]> {
    try {
      const friendships = await this.http.get<any[]>('/api/friendships').toPromise();
      const currentUserFriendships = friendships?.filter(
        friendship =>
          (friendship.finalUser && friendship.finalUser.id === this.currentUserId) ||
          (friendship.finalUser2 && friendship.finalUser2.id === this.currentUserId)
      );
      return currentUserFriendships || [];
    } catch (error) {
      console.error('Error fetching friendships:', error);
      return [];
    }
  }

  async getFilteredUsers(): Promise<any[]> {
    try {
      const finalUsers = await this.http.get<any[]>('/api/final-users').toPromise();
      return finalUsers?.filter(user => user.modules && user.modules.includes('isMentor')) || []; // Add null check and default empty array
    } catch (error) {
      console.error('Error fetching filtered users:', error);
      return [];
    }
  }
}
