import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

declare function greet1(finalUsers: any[]): void;

@Component({
  selector: 'jhi-group-feed',
  templateUrl: './group-feed.component.html',
  styleUrls: ['./group-feed.component.scss'],
})
export class GroupFeedComponent implements OnInit {
  groupForm!: FormGroup;
  constructor(private http: HttpClient, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.groupForm = this.fb.group({
      name: ['', Validators.required],
      groupDescription: ['', Validators.required],
      groupAvatar: [''],
    });
  }
  onSubmit(): void {
    if (this.groupForm.valid) {
      const formData = this.groupForm.value;
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
}
