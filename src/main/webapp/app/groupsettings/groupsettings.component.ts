import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FinalGroupService } from '../entities/final-group/service/final-group.service';
import { IFinalGroup } from '../entities/final-group/final-group.model';
import { HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'jhi-groupsettings',
  templateUrl: './groupsettings.component.html',
  styleUrls: ['./groupsettings.component.scss'],
})
export class GroupsettingsComponent implements OnInit {
  groupId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private finalGroupService: FinalGroupService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {}
  finalgroup: IFinalGroup | null = null;

  groupForm!: FormGroup;
  selectedImage: string | null = null;

  ngOnInit(): void {
    this.groupForm = this.formBuilder.group({
      group_name: [null, Validators.required],
      group_description: [null, Validators.required],
      isAdvertised: [false],
      groupAvatar: [null],
    });

    this.groupId = this.route.snapshot.paramMap.get('groupId') ?? null;
    if (this.groupId) {
      this.loadFinalgroupData(this.groupId);
    }
  }
  initializeForm(): void {
    this.groupForm = this.formBuilder.group({
      group_name: ['', Validators.required],
      group_description: ['', Validators.required],
      isAdvertised: [false],
      groupAvatar: [''],
    });
  }

  loadFinalgroupData(groupId: string): void {
    let integerNumber = parseInt(groupId);

    this.finalGroupService.find(integerNumber).subscribe((response: HttpResponse<IFinalGroup>) => {
      const finalgroup = response.body;
      if (finalgroup) {
        this.finalgroup = finalgroup;
        this.groupForm.get('group_name')?.setValue(this.finalgroup.name);
        this.groupForm.get('group_description')?.setValue(this.finalgroup.groupDescription);
        this.groupForm.get('isAdvertised')?.setValue(this.finalgroup.isAdvertised ?? false);
      }
    });
  }

  onImageClick(imageUrl: string): void {
    this.selectedImage = imageUrl;
    this.groupForm.get('groupAvatar')?.setValue(this.selectedImage);
  }

  onSubmit(): void {
    if (this.groupForm.valid) {
      if (this.finalgroup) {
        this.finalgroup.name = this.groupForm.get('group_name')?.value;
        this.finalgroup.groupDescription = this.groupForm.get('group_description')?.value;
        this.finalgroup.isAdvertised = this.groupForm.get('isAdvertised')?.value;
        this.finalgroup.pfp = this.groupForm.get('groupAvatar')?.value;

        this.finalGroupService.update(this.finalgroup).subscribe(
          (response: HttpResponse<IFinalGroup>) => {
            console.log('Group updated successfully', response);
            this.router.navigate(['/group-feed']);
          },
          error => {
            console.error('Failed to update group', error);
            alert('Failed to update group');
          }
        );
      }
    }
  }
}
