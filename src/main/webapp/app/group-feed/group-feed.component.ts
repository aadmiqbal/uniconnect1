import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
declare function displayFinalGroups(
  finalGroups: any[] | undefined,
  finalUsers: any[] | undefined,
  currentUserId: number | undefined,
  connectToGroup: OmitThisParameter<(groupId: number, userId: number) => Promise<void>>
): void;
declare function displayCurrentGroups(
  finalGroups: any[] | undefined,
  finalUsers: any[] | undefined,
  currentUserId: number | undefined
): void;

@Component({
  selector: 'jhi-group-feed',
  templateUrl: './group-feed.component.html',
  styleUrls: ['./group-feed.component.scss'],
})
export class GroupFeedComponent implements OnInit {
  groupForm!: FormGroup;
  constructor(private http: HttpClient, private fb: FormBuilder) {}
  currentUserId: number | undefined;
  selectedImage: string | null = null;
  isAdvertised!: boolean;

  async connectToGroup(groupId: number, userId: number): Promise<void> {
    try {
      // Fetch the group data
      const group = await this.http.get<any>(`/api/final-groups/${groupId}`).toPromise();

      // Check if the user is already a member
      const membersArray = group.members.split(',');
      if (membersArray.includes(userId.toString())) {
        console.log('User already a member');
        return;
      }

      // Append the user's ID to the members string
      const updatedMembers = group.members + ',' + userId;

      // Update the group
      const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      await this.http.put(`/api/final-groups/${groupId}`, { ...group, members: updatedMembers }, { headers }).toPromise();

      console.log('User connected to group');
      location.reload();
    } catch (error) {
      console.error('Error connecting user to group:', error);
      alert('Error connecting to group');
    }
  }

  async ngOnInit(): Promise<void> {
    this.groupForm = this.fb.group({
      name: ['', Validators.required],
      groupDescription: ['', Validators.required],
      groupAvatar: [''],
    });
    try {
      const account = await this.http.get<any>('/api/account').toPromise();
      this.currentUserId = account.id;
      const finalGroups = await this.http.get<any[]>('/api/final-groups').toPromise();
      const finalUsers = await this.http.get<any[]>('/api/final-users').toPromise();
      displayFinalGroups(finalGroups, finalUsers, this.currentUserId, this.connectToGroup.bind(this));
      displayCurrentGroups(finalGroups, finalUsers, this.currentUserId);
    } catch (error) {
      console.error('Error fetching account or final users:', error);
    }
  }

  onSubmit(): void {
    if (this.groupForm.valid) {
      const formData = this.groupForm.value;
      formData.admins = this.currentUserId;
      formData.members = this.currentUserId;
      formData.pfp = this.selectedImage;
      //need to add in frontend checkbox for advertising
      this.isAdvertised = true;
      formData.isAdvertised = this.isAdvertised;
      this.http.post('/api/final-groups', formData).subscribe(
        result => {
          console.log('Group created:', result);
          // Show success message and close popup here
          alert('Group created successfully');
          location.reload();
        },
        error => {
          console.error('Error creating group:', error);
          // Show error message here
          alert('Error creating group');
        }
      );
    }
  }
  onImageClick(imageUrl: string): void {
    this.selectedImage = imageUrl;
    this.groupForm.get('groupAvatar')?.setValue(this.selectedImage);
  }
}
