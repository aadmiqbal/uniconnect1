import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { UserModulesDetailComponent } from './user-modules-detail.component';

describe('UserModules Management Detail Component', () => {
  let comp: UserModulesDetailComponent;
  let fixture: ComponentFixture<UserModulesDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserModulesDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ userModules: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(UserModulesDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(UserModulesDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load userModules on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.userModules).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
