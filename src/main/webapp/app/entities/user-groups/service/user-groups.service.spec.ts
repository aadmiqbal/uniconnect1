import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IUserGroups } from '../user-groups.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../user-groups.test-samples';

import { UserGroupsService } from './user-groups.service';

const requireRestSample: IUserGroups = {
  ...sampleWithRequiredData,
};

describe('UserGroups Service', () => {
  let service: UserGroupsService;
  let httpMock: HttpTestingController;
  let expectedResult: IUserGroups | IUserGroups[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(UserGroupsService);
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

    it('should create a UserGroups', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const userGroups = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(userGroups).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a UserGroups', () => {
      const userGroups = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(userGroups).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a UserGroups', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of UserGroups', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a UserGroups', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addUserGroupsToCollectionIfMissing', () => {
      it('should add a UserGroups to an empty array', () => {
        const userGroups: IUserGroups = sampleWithRequiredData;
        expectedResult = service.addUserGroupsToCollectionIfMissing([], userGroups);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(userGroups);
      });

      it('should not add a UserGroups to an array that contains it', () => {
        const userGroups: IUserGroups = sampleWithRequiredData;
        const userGroupsCollection: IUserGroups[] = [
          {
            ...userGroups,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addUserGroupsToCollectionIfMissing(userGroupsCollection, userGroups);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a UserGroups to an array that doesn't contain it", () => {
        const userGroups: IUserGroups = sampleWithRequiredData;
        const userGroupsCollection: IUserGroups[] = [sampleWithPartialData];
        expectedResult = service.addUserGroupsToCollectionIfMissing(userGroupsCollection, userGroups);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(userGroups);
      });

      it('should add only unique UserGroups to an array', () => {
        const userGroupsArray: IUserGroups[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const userGroupsCollection: IUserGroups[] = [sampleWithRequiredData];
        expectedResult = service.addUserGroupsToCollectionIfMissing(userGroupsCollection, ...userGroupsArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const userGroups: IUserGroups = sampleWithRequiredData;
        const userGroups2: IUserGroups = sampleWithPartialData;
        expectedResult = service.addUserGroupsToCollectionIfMissing([], userGroups, userGroups2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(userGroups);
        expect(expectedResult).toContain(userGroups2);
      });

      it('should accept null and undefined values', () => {
        const userGroups: IUserGroups = sampleWithRequiredData;
        expectedResult = service.addUserGroupsToCollectionIfMissing([], null, userGroups, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(userGroups);
      });

      it('should return initial array if no UserGroups is added', () => {
        const userGroupsCollection: IUserGroups[] = [sampleWithRequiredData];
        expectedResult = service.addUserGroupsToCollectionIfMissing(userGroupsCollection, undefined, null);
        expect(expectedResult).toEqual(userGroupsCollection);
      });
    });

    describe('compareUserGroups', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareUserGroups(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareUserGroups(entity1, entity2);
        const compareResult2 = service.compareUserGroups(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareUserGroups(entity1, entity2);
        const compareResult2 = service.compareUserGroups(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareUserGroups(entity1, entity2);
        const compareResult2 = service.compareUserGroups(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
