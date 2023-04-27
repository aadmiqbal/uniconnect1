import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { FinalGroupDetailComponent } from './final-group-detail.component';

describe('FinalGroup Management Detail Component', () => {
  let comp: FinalGroupDetailComponent;
  let fixture: ComponentFixture<FinalGroupDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FinalGroupDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ finalGroup: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(FinalGroupDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(FinalGroupDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load finalGroup on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.finalGroup).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
