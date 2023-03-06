import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { MentorLinkService } from '../service/mentor-link.service';

import { MentorLinkComponent } from './mentor-link.component';

describe('MentorLink Management Component', () => {
  let comp: MentorLinkComponent;
  let fixture: ComponentFixture<MentorLinkComponent>;
  let service: MentorLinkService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'mentor-link', component: MentorLinkComponent }]), HttpClientTestingModule],
      declarations: [MentorLinkComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              defaultSort: 'id,asc',
            }),
            queryParamMap: of(
              jest.requireActual('@angular/router').convertToParamMap({
                page: '1',
                size: '1',
                sort: 'id,desc',
              })
            ),
            snapshot: { queryParams: {} },
          },
        },
      ],
    })
      .overrideTemplate(MentorLinkComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(MentorLinkComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(MentorLinkService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.mentorLinks?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to mentorLinkService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getMentorLinkIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getMentorLinkIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
