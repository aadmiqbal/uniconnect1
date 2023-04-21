import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IUserExtra } from '../user-extra.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../user-extra.test-samples';

import { UserExtraService } from './user-extra.service';

const requireRestSample: IUserExtra = {
  ...sampleWithRequiredData,
};

describe('UserExtra Service', () => {
  let service: UserExtraService;
  let httpMock: HttpTestingController;
  let expectedResult: IUserExtra | IUserExtra[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(UserExtraService);
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

    it('should create a UserExtra', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const userExtra = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(userExtra).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a UserExtra', () => {
      const userExtra = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(userExtra).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a UserExtra', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of UserExtra', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a UserExtra', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addUserExtraToCollectionIfMissing', () => {
      it('should add a UserExtra to an empty array', () => {
        const userExtra: IUserExtra = sampleWithRequiredData;
        expectedResult = service.addUserExtraToCollectionIfMissing([], userExtra);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(userExtra);
      });

      it('should not add a UserExtra to an array that contains it', () => {
        const userExtra: IUserExtra = sampleWithRequiredData;
        const userExtraCollection: IUserExtra[] = [
          {
            ...userExtra,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addUserExtraToCollectionIfMissing(userExtraCollection, userExtra);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a UserExtra to an array that doesn't contain it", () => {
        const userExtra: IUserExtra = sampleWithRequiredData;
        const userExtraCollection: IUserExtra[] = [sampleWithPartialData];
        expectedResult = service.addUserExtraToCollectionIfMissing(userExtraCollection, userExtra);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(userExtra);
      });

      it('should add only unique UserExtra to an array', () => {
        const userExtraArray: IUserExtra[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const userExtraCollection: IUserExtra[] = [sampleWithRequiredData];
        expectedResult = service.addUserExtraToCollectionIfMissing(userExtraCollection, ...userExtraArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const userExtra: IUserExtra = sampleWithRequiredData;
        const userExtra2: IUserExtra = sampleWithPartialData;
        expectedResult = service.addUserExtraToCollectionIfMissing([], userExtra, userExtra2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(userExtra);
        expect(expectedResult).toContain(userExtra2);
      });

      it('should accept null and undefined values', () => {
        const userExtra: IUserExtra = sampleWithRequiredData;
        expectedResult = service.addUserExtraToCollectionIfMissing([], null, userExtra, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(userExtra);
      });

      it('should return initial array if no UserExtra is added', () => {
        const userExtraCollection: IUserExtra[] = [sampleWithRequiredData];
        expectedResult = service.addUserExtraToCollectionIfMissing(userExtraCollection, undefined, null);
        expect(expectedResult).toEqual(userExtraCollection);
      });
    });

    describe('compareUserExtra', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareUserExtra(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareUserExtra(entity1, entity2);
        const compareResult2 = service.compareUserExtra(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareUserExtra(entity1, entity2);
        const compareResult2 = service.compareUserExtra(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareUserExtra(entity1, entity2);
        const compareResult2 = service.compareUserExtra(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
