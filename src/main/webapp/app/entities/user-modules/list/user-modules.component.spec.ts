import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { UserModulesService } from '../service/user-modules.service';

import { UserModulesComponent } from './user-modules.component';

describe('UserModules Management Component', () => {
  let comp: UserModulesComponent;
  let fixture: ComponentFixture<UserModulesComponent>;
  let service: UserModulesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'user-modules', component: UserModulesComponent }]), HttpClientTestingModule],
      declarations: [UserModulesComponent],
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
      .overrideTemplate(UserModulesComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(UserModulesComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(UserModulesService);

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
    expect(comp.userModules?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to userModulesService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getUserModulesIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getUserModulesIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
