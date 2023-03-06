import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { DegreesService } from '../service/degrees.service';

import { DegreesComponent } from './degrees.component';

describe('Degrees Management Component', () => {
  let comp: DegreesComponent;
  let fixture: ComponentFixture<DegreesComponent>;
  let service: DegreesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'degrees', component: DegreesComponent }]), HttpClientTestingModule],
      declarations: [DegreesComponent],
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
      .overrideTemplate(DegreesComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(DegreesComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(DegreesService);

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
    expect(comp.degrees?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to degreesService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getDegreesIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getDegreesIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
