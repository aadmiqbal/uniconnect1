import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ModuleLinkService } from '../service/module-link.service';

import { ModuleLinkComponent } from './module-link.component';

describe('ModuleLink Management Component', () => {
  let comp: ModuleLinkComponent;
  let fixture: ComponentFixture<ModuleLinkComponent>;
  let service: ModuleLinkService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'module-link', component: ModuleLinkComponent }]), HttpClientTestingModule],
      declarations: [ModuleLinkComponent],
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
      .overrideTemplate(ModuleLinkComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ModuleLinkComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ModuleLinkService);

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
    expect(comp.moduleLinks?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to moduleLinkService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getModuleLinkIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getModuleLinkIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
