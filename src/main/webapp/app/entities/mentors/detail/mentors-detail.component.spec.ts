import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { MentorsDetailComponent } from './mentors-detail.component';

describe('Mentors Management Detail Component', () => {
  let comp: MentorsDetailComponent;
  let fixture: ComponentFixture<MentorsDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MentorsDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ mentors: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(MentorsDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(MentorsDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load mentors on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.mentors).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
