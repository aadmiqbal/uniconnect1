import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { DegreesDetailComponent } from './degrees-detail.component';

describe('Degrees Management Detail Component', () => {
  let comp: DegreesDetailComponent;
  let fixture: ComponentFixture<DegreesDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DegreesDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ degrees: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(DegreesDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(DegreesDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load degrees on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.degrees).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
