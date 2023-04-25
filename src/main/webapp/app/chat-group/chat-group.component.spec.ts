import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatGroupComponent } from './chat-group.component';

describe('ChatGroupComponent', () => {
  let component: ChatGroupComponent;
  let fixture: ComponentFixture<ChatGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChatGroupComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ChatGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    // @ts-ignore
    expect(component).toBeTruthy();
  });
});
