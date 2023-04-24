import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { FinalUserDetailComponent } from './final-user-detail.component';

describe('FinalUser Management Detail Component', () => {
  let comp: FinalUserDetailComponent;
  let fixture: ComponentFixture<FinalUserDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FinalUserDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ finalUser: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(FinalUserDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(FinalUserDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load finalUser on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.finalUser).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
