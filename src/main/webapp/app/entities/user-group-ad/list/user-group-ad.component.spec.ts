import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { UserGroupAdService } from '../service/user-group-ad.service';

import { UserGroupAdComponent } from './user-group-ad.component';

describe('UserGroupAd Management Component', () => {
  let comp: UserGroupAdComponent;
  let fixture: ComponentFixture<UserGroupAdComponent>;
  let service: UserGroupAdService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'user-group-ad', component: UserGroupAdComponent }]), HttpClientTestingModule],
      declarations: [UserGroupAdComponent],
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
      .overrideTemplate(UserGroupAdComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(UserGroupAdComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(UserGroupAdService);

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
    expect(comp.userGroupAds?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to userGroupAdService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getUserGroupAdIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getUserGroupAdIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
