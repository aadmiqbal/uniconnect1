import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { IOptionalModuleLink } from '../optional-module-link.model';
import { OptionalModuleLinkService } from '../service/optional-module-link.service';

import { OptionalModuleLinkRoutingResolveService } from './optional-module-link-routing-resolve.service';

describe('OptionalModuleLink routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: OptionalModuleLinkRoutingResolveService;
  let service: OptionalModuleLinkService;
  let resultOptionalModuleLink: IOptionalModuleLink | null | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({}),
            },
          },
        },
      ],
    });
    mockRouter = TestBed.inject(Router);
    jest.spyOn(mockRouter, 'navigate').mockImplementation(() => Promise.resolve(true));
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRoute).snapshot;
    routingResolveService = TestBed.inject(OptionalModuleLinkRoutingResolveService);
    service = TestBed.inject(OptionalModuleLinkService);
    resultOptionalModuleLink = undefined;
  });

  describe('resolve', () => {
    it('should return IOptionalModuleLink returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultOptionalModuleLink = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultOptionalModuleLink).toEqual({ id: 123 });
    });

    it('should return null if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultOptionalModuleLink = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultOptionalModuleLink).toEqual(null);
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse<IOptionalModuleLink>({ body: null })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultOptionalModuleLink = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultOptionalModuleLink).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
