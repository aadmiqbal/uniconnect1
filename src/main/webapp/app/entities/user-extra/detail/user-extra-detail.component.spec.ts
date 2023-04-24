import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { UserExtraDetailComponent } from './user-extra-detail.component';

describe('UserExtra Management Detail Component', () => {
  let comp: UserExtraDetailComponent;
  let fixture: ComponentFixture<UserExtraDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserExtraDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ userExtra: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(UserExtraDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(UserExtraDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load userExtra on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.userExtra).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
