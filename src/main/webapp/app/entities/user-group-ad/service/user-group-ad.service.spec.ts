import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IUserGroupAd } from '../user-group-ad.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../user-group-ad.test-samples';

import { UserGroupAdService } from './user-group-ad.service';

const requireRestSample: IUserGroupAd = {
  ...sampleWithRequiredData,
};

describe('UserGroupAd Service', () => {
  let service: UserGroupAdService;
  let httpMock: HttpTestingController;
  let expectedResult: IUserGroupAd | IUserGroupAd[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(UserGroupAdService);
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

    it('should create a UserGroupAd', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const userGroupAd = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(userGroupAd).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a UserGroupAd', () => {
      const userGroupAd = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(userGroupAd).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a UserGroupAd', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of UserGroupAd', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a UserGroupAd', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addUserGroupAdToCollectionIfMissing', () => {
      it('should add a UserGroupAd to an empty array', () => {
        const userGroupAd: IUserGroupAd = sampleWithRequiredData;
        expectedResult = service.addUserGroupAdToCollectionIfMissing([], userGroupAd);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(userGroupAd);
      });

      it('should not add a UserGroupAd to an array that contains it', () => {
        const userGroupAd: IUserGroupAd = sampleWithRequiredData;
        const userGroupAdCollection: IUserGroupAd[] = [
          {
            ...userGroupAd,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addUserGroupAdToCollectionIfMissing(userGroupAdCollection, userGroupAd);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a UserGroupAd to an array that doesn't contain it", () => {
        const userGroupAd: IUserGroupAd = sampleWithRequiredData;
        const userGroupAdCollection: IUserGroupAd[] = [sampleWithPartialData];
        expectedResult = service.addUserGroupAdToCollectionIfMissing(userGroupAdCollection, userGroupAd);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(userGroupAd);
      });

      it('should add only unique UserGroupAd to an array', () => {
        const userGroupAdArray: IUserGroupAd[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const userGroupAdCollection: IUserGroupAd[] = [sampleWithRequiredData];
        expectedResult = service.addUserGroupAdToCollectionIfMissing(userGroupAdCollection, ...userGroupAdArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const userGroupAd: IUserGroupAd = sampleWithRequiredData;
        const userGroupAd2: IUserGroupAd = sampleWithPartialData;
        expectedResult = service.addUserGroupAdToCollectionIfMissing([], userGroupAd, userGroupAd2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(userGroupAd);
        expect(expectedResult).toContain(userGroupAd2);
      });

      it('should accept null and undefined values', () => {
        const userGroupAd: IUserGroupAd = sampleWithRequiredData;
        expectedResult = service.addUserGroupAdToCollectionIfMissing([], null, userGroupAd, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(userGroupAd);
      });

      it('should return initial array if no UserGroupAd is added', () => {
        const userGroupAdCollection: IUserGroupAd[] = [sampleWithRequiredData];
        expectedResult = service.addUserGroupAdToCollectionIfMissing(userGroupAdCollection, undefined, null);
        expect(expectedResult).toEqual(userGroupAdCollection);
      });
    });

    describe('compareUserGroupAd', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareUserGroupAd(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareUserGroupAd(entity1, entity2);
        const compareResult2 = service.compareUserGroupAd(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareUserGroupAd(entity1, entity2);
        const compareResult2 = service.compareUserGroupAd(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareUserGroupAd(entity1, entity2);
        const compareResult2 = service.compareUserGroupAd(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
