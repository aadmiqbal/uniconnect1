import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenteeModuleSelectionComponent } from './mentee-module-selection.component';

describe('MenteeModuleSelectionComponent', () => {
  let component: MenteeModuleSelectionComponent;
  let fixture: ComponentFixture<MenteeModuleSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MenteeModuleSelectionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MenteeModuleSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
