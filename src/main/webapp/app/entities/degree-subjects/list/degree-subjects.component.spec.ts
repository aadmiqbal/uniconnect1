import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { DegreeSubjectsService } from '../service/degree-subjects.service';

import { DegreeSubjectsComponent } from './degree-subjects.component';

describe('DegreeSubjects Management Component', () => {
  let comp: DegreeSubjectsComponent;
  let fixture: ComponentFixture<DegreeSubjectsComponent>;
  let service: DegreeSubjectsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'degree-subjects', component: DegreeSubjectsComponent }]), HttpClientTestingModule],
      declarations: [DegreeSubjectsComponent],
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
      .overrideTemplate(DegreeSubjectsComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(DegreeSubjectsComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(DegreeSubjectsService);

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
    expect(comp.degreeSubjects?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to degreeSubjectsService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getDegreeSubjectsIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getDegreeSubjectsIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
