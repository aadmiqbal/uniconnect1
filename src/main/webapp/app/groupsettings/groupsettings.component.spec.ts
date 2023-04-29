import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupsettingsComponent } from './groupsettings.component';

describe('GroupsettingsComponent', () => {
  let component: GroupsettingsComponent;
  let fixture: ComponentFixture<GroupsettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GroupsettingsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GroupsettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
