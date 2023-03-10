import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IAppUserLogins } from '../app-user-logins.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../app-user-logins.test-samples';

import { AppUserLoginsService } from './app-user-logins.service';

const requireRestSample: IAppUserLogins = {
  ...sampleWithRequiredData,
};

describe('AppUserLogins Service', () => {
  let service: AppUserLoginsService;
  let httpMock: HttpTestingController;
  let expectedResult: IAppUserLogins | IAppUserLogins[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(AppUserLoginsService);
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

    it('should create a AppUserLogins', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const appUserLogins = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(appUserLogins).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a AppUserLogins', () => {
      const appUserLogins = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(appUserLogins).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a AppUserLogins', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of AppUserLogins', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a AppUserLogins', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addAppUserLoginsToCollectionIfMissing', () => {
      it('should add a AppUserLogins to an empty array', () => {
        const appUserLogins: IAppUserLogins = sampleWithRequiredData;
        expectedResult = service.addAppUserLoginsToCollectionIfMissing([], appUserLogins);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(appUserLogins);
      });

      it('should not add a AppUserLogins to an array that contains it', () => {
        const appUserLogins: IAppUserLogins = sampleWithRequiredData;
        const appUserLoginsCollection: IAppUserLogins[] = [
          {
            ...appUserLogins,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addAppUserLoginsToCollectionIfMissing(appUserLoginsCollection, appUserLogins);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a AppUserLogins to an array that doesn't contain it", () => {
        const appUserLogins: IAppUserLogins = sampleWithRequiredData;
        const appUserLoginsCollection: IAppUserLogins[] = [sampleWithPartialData];
        expectedResult = service.addAppUserLoginsToCollectionIfMissing(appUserLoginsCollection, appUserLogins);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(appUserLogins);
      });

      it('should add only unique AppUserLogins to an array', () => {
        const appUserLoginsArray: IAppUserLogins[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const appUserLoginsCollection: IAppUserLogins[] = [sampleWithRequiredData];
        expectedResult = service.addAppUserLoginsToCollectionIfMissing(appUserLoginsCollection, ...appUserLoginsArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const appUserLogins: IAppUserLogins = sampleWithRequiredData;
        const appUserLogins2: IAppUserLogins = sampleWithPartialData;
        expectedResult = service.addAppUserLoginsToCollectionIfMissing([], appUserLogins, appUserLogins2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(appUserLogins);
        expect(expectedResult).toContain(appUserLogins2);
      });

      it('should accept null and undefined values', () => {
        const appUserLogins: IAppUserLogins = sampleWithRequiredData;
        expectedResult = service.addAppUserLoginsToCollectionIfMissing([], null, appUserLogins, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(appUserLogins);
      });

      it('should return initial array if no AppUserLogins is added', () => {
        const appUserLoginsCollection: IAppUserLogins[] = [sampleWithRequiredData];
        expectedResult = service.addAppUserLoginsToCollectionIfMissing(appUserLoginsCollection, undefined, null);
        expect(expectedResult).toEqual(appUserLoginsCollection);
      });
    });

    describe('compareAppUserLogins', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareAppUserLogins(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareAppUserLogins(entity1, entity2);
        const compareResult2 = service.compareAppUserLogins(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareAppUserLogins(entity1, entity2);
        const compareResult2 = service.compareAppUserLogins(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareAppUserLogins(entity1, entity2);
        const compareResult2 = service.compareAppUserLogins(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
