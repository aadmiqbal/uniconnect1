import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { FriendshipDetailComponent } from './friendship-detail.component';

describe('Friendship Management Detail Component', () => {
  let comp: FriendshipDetailComponent;
  let fixture: ComponentFixture<FriendshipDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FriendshipDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ friendship: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(FriendshipDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(FriendshipDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load friendship on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.friendship).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
