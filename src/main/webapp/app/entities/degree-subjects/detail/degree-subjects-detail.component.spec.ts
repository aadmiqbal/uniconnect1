import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { DegreeSubjectsDetailComponent } from './degree-subjects-detail.component';

describe('DegreeSubjects Management Detail Component', () => {
  let comp: DegreeSubjectsDetailComponent;
  let fixture: ComponentFixture<DegreeSubjectsDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DegreeSubjectsDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ degreeSubjects: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(DegreeSubjectsDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(DegreeSubjectsDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load degreeSubjects on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.degreeSubjects).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
