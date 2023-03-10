import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { AppUserLoginsService } from '../service/app-user-logins.service';

import { AppUserLoginsComponent } from './app-user-logins.component';

describe('AppUserLogins Management Component', () => {
  let comp: AppUserLoginsComponent;
  let fixture: ComponentFixture<AppUserLoginsComponent>;
  let service: AppUserLoginsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'app-user-logins', component: AppUserLoginsComponent }]), HttpClientTestingModule],
      declarations: [AppUserLoginsComponent],
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
      .overrideTemplate(AppUserLoginsComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AppUserLoginsComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(AppUserLoginsService);

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
    expect(comp.appUserLogins?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to appUserLoginsService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getAppUserLoginsIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getAppUserLoginsIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
