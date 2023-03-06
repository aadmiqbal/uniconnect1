import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { SubjectsService } from '../service/subjects.service';

import { SubjectsComponent } from './subjects.component';

describe('Subjects Management Component', () => {
  let comp: SubjectsComponent;
  let fixture: ComponentFixture<SubjectsComponent>;
  let service: SubjectsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'subjects', component: SubjectsComponent }]), HttpClientTestingModule],
      declarations: [SubjectsComponent],
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
      .overrideTemplate(SubjectsComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(SubjectsComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(SubjectsService);

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
    expect(comp.subjects?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to subjectsService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getSubjectsIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getSubjectsIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
