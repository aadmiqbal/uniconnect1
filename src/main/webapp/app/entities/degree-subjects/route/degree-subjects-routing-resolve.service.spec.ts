import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { IDegreeSubjects } from '../degree-subjects.model';
import { DegreeSubjectsService } from '../service/degree-subjects.service';

import { DegreeSubjectsRoutingResolveService } from './degree-subjects-routing-resolve.service';

describe('DegreeSubjects routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: DegreeSubjectsRoutingResolveService;
  let service: DegreeSubjectsService;
  let resultDegreeSubjects: IDegreeSubjects | null | undefined;

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
    routingResolveService = TestBed.inject(DegreeSubjectsRoutingResolveService);
    service = TestBed.inject(DegreeSubjectsService);
    resultDegreeSubjects = undefined;
  });

  describe('resolve', () => {
    it('should return IDegreeSubjects returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultDegreeSubjects = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultDegreeSubjects).toEqual({ id: 123 });
    });

    it('should return null if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultDegreeSubjects = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultDegreeSubjects).toEqual(null);
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse<IDegreeSubjects>({ body: null })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultDegreeSubjects = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultDegreeSubjects).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
