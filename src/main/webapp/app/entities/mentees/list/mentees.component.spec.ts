import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { MenteesService } from '../service/mentees.service';

import { MenteesComponent } from './mentees.component';

describe('Mentees Management Component', () => {
  let comp: MenteesComponent;
  let fixture: ComponentFixture<MenteesComponent>;
  let service: MenteesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'mentees', component: MenteesComponent }]), HttpClientTestingModule],
      declarations: [MenteesComponent],
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
      .overrideTemplate(MenteesComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(MenteesComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(MenteesService);

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
    expect(comp.mentees?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to menteesService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getMenteesIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getMenteesIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
