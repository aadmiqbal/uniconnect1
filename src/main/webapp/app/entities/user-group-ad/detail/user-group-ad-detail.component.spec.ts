import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { UserGroupAdDetailComponent } from './user-group-ad-detail.component';

describe('UserGroupAd Management Detail Component', () => {
  let comp: UserGroupAdDetailComponent;
  let fixture: ComponentFixture<UserGroupAdDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserGroupAdDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ userGroupAd: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(UserGroupAdDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(UserGroupAdDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load userGroupAd on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.userGroupAd).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
