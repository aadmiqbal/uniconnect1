import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { AppUsersDetailComponent } from './app-users-detail.component';

describe('AppUsers Management Detail Component', () => {
  let comp: AppUsersDetailComponent;
  let fixture: ComponentFixture<AppUsersDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AppUsersDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ appUsers: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(AppUsersDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(AppUsersDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load appUsers on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.appUsers).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
