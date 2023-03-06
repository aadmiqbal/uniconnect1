import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { MentorLinkDetailComponent } from './mentor-link-detail.component';

describe('MentorLink Management Detail Component', () => {
  let comp: MentorLinkDetailComponent;
  let fixture: ComponentFixture<MentorLinkDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MentorLinkDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ mentorLink: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(MentorLinkDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(MentorLinkDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load mentorLink on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.mentorLink).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
