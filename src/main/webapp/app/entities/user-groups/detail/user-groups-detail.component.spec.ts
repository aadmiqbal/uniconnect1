import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { UserGroupsDetailComponent } from './user-groups-detail.component';

describe('UserGroups Management Detail Component', () => {
  let comp: UserGroupsDetailComponent;
  let fixture: ComponentFixture<UserGroupsDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserGroupsDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ userGroups: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(UserGroupsDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(UserGroupsDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load userGroups on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.userGroups).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
