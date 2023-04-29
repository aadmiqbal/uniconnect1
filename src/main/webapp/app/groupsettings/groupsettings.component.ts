import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
@Component({
  selector: 'jhi-groupsettings',
  templateUrl: './groupsettings.component.html',
  styleUrls: ['./groupsettings.component.scss'],
})
export class GroupsettingsComponent implements OnInit {
  constructor() {}
  groupForm!: FormGroup;
  selectedImage: string | null = null;
  ngOnInit(): void {}
  onImageClick(imageUrl: string): void {
    this.selectedImage = imageUrl;
    this.groupForm.get('groupAvatar')?.setValue(this.selectedImage);
  }
}
