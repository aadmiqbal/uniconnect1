import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IUserGroupUsers } from '../user-group-users.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../user-group-users.test-samples';

import { UserGroupUsersService } from './user-group-users.service';

const requireRestSample: IUserGroupUsers = {
  ...sampleWithRequiredData,
};

describe('UserGroupUsers Service', () => {
  let service: UserGroupUsersService;
  let httpMock: HttpTestingController;
  let expectedResult: IUserGroupUsers | IUserGroupUsers[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(UserGroupUsersService);
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

    it('should create a UserGroupUsers', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const userGroupUsers = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(userGroupUsers).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a UserGroupUsers', () => {
      const userGroupUsers = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(userGroupUsers).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a UserGroupUsers', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of UserGroupUsers', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a UserGroupUsers', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addUserGroupUsersToCollectionIfMissing', () => {
      it('should add a UserGroupUsers to an empty array', () => {
        const userGroupUsers: IUserGroupUsers = sampleWithRequiredData;
        expectedResult = service.addUserGroupUsersToCollectionIfMissing([], userGroupUsers);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(userGroupUsers);
      });

      it('should not add a UserGroupUsers to an array that contains it', () => {
        const userGroupUsers: IUserGroupUsers = sampleWithRequiredData;
        const userGroupUsersCollection: IUserGroupUsers[] = [
          {
            ...userGroupUsers,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addUserGroupUsersToCollectionIfMissing(userGroupUsersCollection, userGroupUsers);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a UserGroupUsers to an array that doesn't contain it", () => {
        const userGroupUsers: IUserGroupUsers = sampleWithRequiredData;
        const userGroupUsersCollection: IUserGroupUsers[] = [sampleWithPartialData];
        expectedResult = service.addUserGroupUsersToCollectionIfMissing(userGroupUsersCollection, userGroupUsers);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(userGroupUsers);
      });

      it('should add only unique UserGroupUsers to an array', () => {
        const userGroupUsersArray: IUserGroupUsers[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const userGroupUsersCollection: IUserGroupUsers[] = [sampleWithRequiredData];
        expectedResult = service.addUserGroupUsersToCollectionIfMissing(userGroupUsersCollection, ...userGroupUsersArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const userGroupUsers: IUserGroupUsers = sampleWithRequiredData;
        const userGroupUsers2: IUserGroupUsers = sampleWithPartialData;
        expectedResult = service.addUserGroupUsersToCollectionIfMissing([], userGroupUsers, userGroupUsers2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(userGroupUsers);
        expect(expectedResult).toContain(userGroupUsers2);
      });

      it('should accept null and undefined values', () => {
        const userGroupUsers: IUserGroupUsers = sampleWithRequiredData;
        expectedResult = service.addUserGroupUsersToCollectionIfMissing([], null, userGroupUsers, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(userGroupUsers);
      });

      it('should return initial array if no UserGroupUsers is added', () => {
        const userGroupUsersCollection: IUserGroupUsers[] = [sampleWithRequiredData];
        expectedResult = service.addUserGroupUsersToCollectionIfMissing(userGroupUsersCollection, undefined, null);
        expect(expectedResult).toEqual(userGroupUsersCollection);
      });
    });

    describe('compareUserGroupUsers', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareUserGroupUsers(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareUserGroupUsers(entity1, entity2);
        const compareResult2 = service.compareUserGroupUsers(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareUserGroupUsers(entity1, entity2);
        const compareResult2 = service.compareUserGroupUsers(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareUserGroupUsers(entity1, entity2);
        const compareResult2 = service.compareUserGroupUsers(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
