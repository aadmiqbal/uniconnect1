import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

declare function greet(
  finalUser: any[] | undefined,
  currentUserId: number | undefined,
  postFriendshipCallback: (currentUserId: number, otherUserId: number) => Promise<void>,
  currentFriendships: any[] | undefined,
  isMentorSelected: boolean,
  deleteFriendshipCallback: (currentUserId: number, otherUserId: number) => Promise<void>
): void;

@Component({
  selector: 'jhi-connections-feed',
  templateUrl: './connections-feed.component.html',
  styleUrls: ['./connections-feed.component.scss'],
})
export class ConnectionsFeedComponent implements OnInit {
  constructor(private http: HttpClient, private route: ActivatedRoute) {}

  currentUserId: number | undefined;
  isMentorSelected = false;
  allUsers: any[] = [];
  mentorUsers: any[] = [];
  isChecked: boolean | undefined;

  async ngOnInit(): Promise<void> {
    try {
      const account = await this.http.get<any>('/api/account').toPromise();
      this.currentUserId = account.id;
      const currentFriendships = await this.getFriendshipsForCurrentUser();
      this.isChecked = this.route.snapshot.paramMap.get('isChecked') == 'true';
      this.isMentorSelected = this.isChecked;
      this.allUsers = (await this.http.get<any[]>('/api/final-users').toPromise()) || [];

      this.mentorUsers = this.allUsers.filter(user => user.modules && user.modules.includes('isMentor'));

      greet(
        this.getMentorUsersToDisplay(),
        this.currentUserId,
        this.postFriendship.bind(this),
        currentFriendships,
        this.isMentorSelected,
        this.deleteFriendship.bind(this)
      );
    } catch (error) {
      console.error('Error fetching account or final users:', error);
    }
    window.onscroll = this.setScroll;
  }

  setScroll(): void {
    if (window.scrollY > 0) document.getElementById('topScroller')!.style.display = 'flex';
    else document.getElementById('topScroller')!.style.display = 'none';
  }

  toTheTop() {
    window.scrollTo({ top: 0 });
    document.getElementById('topScroller')!.style.display = 'none';
  }

  async toggleMentorFilter(): Promise<void> {
    this.isMentorSelected = !this.isMentorSelected;
    const currentFriendships = await this.getFriendshipsForCurrentUser();
    greet(
      this.allUsers,
      this.currentUserId,
      this.postFriendship.bind(this),
      currentFriendships,
      this.isMentorSelected,
      this.deleteFriendship.bind(this)
    );
  }

  private getMentorUsersToDisplay(): any[] {
    return this.isMentorSelected ? this.mentorUsers : this.allUsers;
  }
  public async postFriendship(currentUserId: number, otherUserId: number): Promise<void> {
    const payload = {
      finalUser: { id: currentUserId },
      finalUser2: { id: otherUserId },
    };

    try {
      await this.http.post<void>('/api/friendships', payload).toPromise();
      alert('Connection added successfully!');
      window.location.reload();
    } catch (error) {
      console.error(error);
      alert('Failed to add connection');
    }
  }

  public async deleteFriendship(currentUserId: number, otherUserId: number): Promise<void> {
    try {
      const friendships = await this.http.get<any[]>(`/api/friendships/final-user-either/${currentUserId}`).toPromise();

      console.log(friendships);

      const friendship = friendships!.find(f => f.finalUser.id == otherUserId || f.finalUser2.id == otherUserId);

      console.log(friendship);

      if (!friendship) {
        alert('Friendship not found');
        return;
      }

      await this.http.delete<void>(`/api/friendships/${friendship.id}`).toPromise();
      alert('Friendship deleted successfully!');
      window.location.reload();
    } catch (error) {
      console.error(error);
      alert('Failed to delete friendship');
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
