import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IUserModules } from '../user-modules.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../user-modules.test-samples';

import { UserModulesService } from './user-modules.service';

const requireRestSample: IUserModules = {
  ...sampleWithRequiredData,
};

describe('UserModules Service', () => {
  let service: UserModulesService;
  let httpMock: HttpTestingController;
  let expectedResult: IUserModules | IUserModules[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(UserModulesService);
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

    it('should create a UserModules', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const userModules = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(userModules).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a UserModules', () => {
      const userModules = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(userModules).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a UserModules', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of UserModules', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a UserModules', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addUserModulesToCollectionIfMissing', () => {
      it('should add a UserModules to an empty array', () => {
        const userModules: IUserModules = sampleWithRequiredData;
        expectedResult = service.addUserModulesToCollectionIfMissing([], userModules);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(userModules);
      });

      it('should not add a UserModules to an array that contains it', () => {
        const userModules: IUserModules = sampleWithRequiredData;
        const userModulesCollection: IUserModules[] = [
          {
            ...userModules,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addUserModulesToCollectionIfMissing(userModulesCollection, userModules);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a UserModules to an array that doesn't contain it", () => {
        const userModules: IUserModules = sampleWithRequiredData;
        const userModulesCollection: IUserModules[] = [sampleWithPartialData];
        expectedResult = service.addUserModulesToCollectionIfMissing(userModulesCollection, userModules);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(userModules);
      });

      it('should add only unique UserModules to an array', () => {
        const userModulesArray: IUserModules[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const userModulesCollection: IUserModules[] = [sampleWithRequiredData];
        expectedResult = service.addUserModulesToCollectionIfMissing(userModulesCollection, ...userModulesArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const userModules: IUserModules = sampleWithRequiredData;
        const userModules2: IUserModules = sampleWithPartialData;
        expectedResult = service.addUserModulesToCollectionIfMissing([], userModules, userModules2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(userModules);
        expect(expectedResult).toContain(userModules2);
      });

      it('should accept null and undefined values', () => {
        const userModules: IUserModules = sampleWithRequiredData;
        expectedResult = service.addUserModulesToCollectionIfMissing([], null, userModules, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(userModules);
      });

      it('should return initial array if no UserModules is added', () => {
        const userModulesCollection: IUserModules[] = [sampleWithRequiredData];
        expectedResult = service.addUserModulesToCollectionIfMissing(userModulesCollection, undefined, null);
        expect(expectedResult).toEqual(userModulesCollection);
      });
    });

    describe('compareUserModules', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareUserModules(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareUserModules(entity1, entity2);
        const compareResult2 = service.compareUserModules(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareUserModules(entity1, entity2);
        const compareResult2 = service.compareUserModules(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareUserModules(entity1, entity2);
        const compareResult2 = service.compareUserModules(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
