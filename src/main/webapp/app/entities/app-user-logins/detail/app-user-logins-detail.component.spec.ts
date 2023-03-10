import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { AppUserLoginsDetailComponent } from './app-user-logins-detail.component';

describe('AppUserLogins Management Detail Component', () => {
  let comp: AppUserLoginsDetailComponent;
  let fixture: ComponentFixture<AppUserLoginsDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AppUserLoginsDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ appUserLogins: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(AppUserLoginsDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(AppUserLoginsDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load appUserLogins on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.appUserLogins).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
