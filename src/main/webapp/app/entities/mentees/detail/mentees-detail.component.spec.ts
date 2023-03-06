import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { MenteesDetailComponent } from './mentees-detail.component';

describe('Mentees Management Detail Component', () => {
  let comp: MenteesDetailComponent;
  let fixture: ComponentFixture<MenteesDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MenteesDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ mentees: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(MenteesDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(MenteesDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load mentees on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.mentees).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
