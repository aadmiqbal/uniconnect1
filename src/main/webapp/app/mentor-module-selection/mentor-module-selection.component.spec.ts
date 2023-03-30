import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MentorModuleSelectionComponent } from './mentor-module-selection.component';

describe('MentorModuleSelectionComponent', () => {
  let component: MentorModuleSelectionComponent;
  let fixture: ComponentFixture<MentorModuleSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MentorModuleSelectionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MentorModuleSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
