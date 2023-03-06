import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { OptionalModuleLinkService } from '../service/optional-module-link.service';

import { OptionalModuleLinkComponent } from './optional-module-link.component';

describe('OptionalModuleLink Management Component', () => {
  let comp: OptionalModuleLinkComponent;
  let fixture: ComponentFixture<OptionalModuleLinkComponent>;
  let service: OptionalModuleLinkService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'optional-module-link', component: OptionalModuleLinkComponent }]),
        HttpClientTestingModule,
      ],
      declarations: [OptionalModuleLinkComponent],
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
      .overrideTemplate(OptionalModuleLinkComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(OptionalModuleLinkComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(OptionalModuleLinkService);

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
    expect(comp.optionalModuleLinks?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to optionalModuleLinkService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getOptionalModuleLinkIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getOptionalModuleLinkIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
