import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IAppUsers } from '../app-users.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../app-users.test-samples';

import { AppUsersService } from './app-users.service';

const requireRestSample: IAppUsers = {
  ...sampleWithRequiredData,
};

describe('AppUsers Service', () => {
  let service: AppUsersService;
  let httpMock: HttpTestingController;
  let expectedResult: IAppUsers | IAppUsers[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(AppUsersService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a AppUsers', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const appUsers = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(appUsers).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a AppUsers', () => {
      const appUsers = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(appUsers).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a AppUsers', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of AppUsers', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a AppUsers', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addAppUsersToCollectionIfMissing', () => {
      it('should add a AppUsers to an empty array', () => {
        const appUsers: IAppUsers = sampleWithRequiredData;
        expectedResult = service.addAppUsersToCollectionIfMissing([], appUsers);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(appUsers);
      });

      it('should not add a AppUsers to an array that contains it', () => {
        const appUsers: IAppUsers = sampleWithRequiredData;
        const appUsersCollection: IAppUsers[] = [
          {
            ...appUsers,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addAppUsersToCollectionIfMissing(appUsersCollection, appUsers);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a AppUsers to an array that doesn't contain it", () => {
        const appUsers: IAppUsers = sampleWithRequiredData;
        const appUsersCollection: IAppUsers[] = [sampleWithPartialData];
        expectedResult = service.addAppUsersToCollectionIfMissing(appUsersCollection, appUsers);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(appUsers);
      });

      it('should add only unique AppUsers to an array', () => {
        const appUsersArray: IAppUsers[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const appUsersCollection: IAppUsers[] = [sampleWithRequiredData];
        expectedResult = service.addAppUsersToCollectionIfMissing(appUsersCollection, ...appUsersArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const appUsers: IAppUsers = sampleWithRequiredData;
        const appUsers2: IAppUsers = sampleWithPartialData;
        expectedResult = service.addAppUsersToCollectionIfMissing([], appUsers, appUsers2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(appUsers);
        expect(expectedResult).toContain(appUsers2);
      });

      it('should accept null and undefined values', () => {
        const appUsers: IAppUsers = sampleWithRequiredData;
        expectedResult = service.addAppUsersToCollectionIfMissing([], null, appUsers, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(appUsers);
      });

      it('should return initial array if no AppUsers is added', () => {
        const appUsersCollection: IAppUsers[] = [sampleWithRequiredData];
        expectedResult = service.addAppUsersToCollectionIfMissing(appUsersCollection, undefined, null);
        expect(expectedResult).toEqual(appUsersCollection);
      });
    });

    describe('compareAppUsers', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareAppUsers(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareAppUsers(entity1, entity2);
        const compareResult2 = service.compareAppUsers(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareAppUsers(entity1, entity2);
        const compareResult2 = service.compareAppUsers(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareAppUsers(entity1, entity2);
        const compareResult2 = service.compareAppUsers(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
