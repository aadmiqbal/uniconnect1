import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectionsFeedComponent } from './connections-feed.component';

describe('ConnectionsFeedComponent', () => {
  let component: ConnectionsFeedComponent;
  let fixture: ComponentFixture<ConnectionsFeedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConnectionsFeedComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ConnectionsFeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
