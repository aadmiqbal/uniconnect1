import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { UserGroupUsersDetailComponent } from './user-group-users-detail.component';

describe('UserGroupUsers Management Detail Component', () => {
  let comp: UserGroupUsersDetailComponent;
  let fixture: ComponentFixture<UserGroupUsersDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserGroupUsersDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ userGroupUsers: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(UserGroupUsersDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(UserGroupUsersDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load userGroupUsers on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.userGroupUsers).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
