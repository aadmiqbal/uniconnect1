import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IFinalUser } from '../final-user.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../final-user.test-samples';

import { FinalUserService } from './final-user.service';

const requireRestSample: IFinalUser = {
  ...sampleWithRequiredData,
};

describe('FinalUser Service', () => {
  let service: FinalUserService;
  let httpMock: HttpTestingController;
  let expectedResult: IFinalUser | IFinalUser[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(FinalUserService);
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

    it('should create a FinalUser', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const finalUser = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(finalUser).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a FinalUser', () => {
      const finalUser = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(finalUser).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a FinalUser', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of FinalUser', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a FinalUser', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addFinalUserToCollectionIfMissing', () => {
      it('should add a FinalUser to an empty array', () => {
        const finalUser: IFinalUser = sampleWithRequiredData;
        expectedResult = service.addFinalUserToCollectionIfMissing([], finalUser);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(finalUser);
      });

      it('should not add a FinalUser to an array that contains it', () => {
        const finalUser: IFinalUser = sampleWithRequiredData;
        const finalUserCollection: IFinalUser[] = [
          {
            ...finalUser,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addFinalUserToCollectionIfMissing(finalUserCollection, finalUser);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a FinalUser to an array that doesn't contain it", () => {
        const finalUser: IFinalUser = sampleWithRequiredData;
        const finalUserCollection: IFinalUser[] = [sampleWithPartialData];
        expectedResult = service.addFinalUserToCollectionIfMissing(finalUserCollection, finalUser);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(finalUser);
      });

      it('should add only unique FinalUser to an array', () => {
        const finalUserArray: IFinalUser[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const finalUserCollection: IFinalUser[] = [sampleWithRequiredData];
        expectedResult = service.addFinalUserToCollectionIfMissing(finalUserCollection, ...finalUserArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const finalUser: IFinalUser = sampleWithRequiredData;
        const finalUser2: IFinalUser = sampleWithPartialData;
        expectedResult = service.addFinalUserToCollectionIfMissing([], finalUser, finalUser2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(finalUser);
        expect(expectedResult).toContain(finalUser2);
      });

      it('should accept null and undefined values', () => {
        const finalUser: IFinalUser = sampleWithRequiredData;
        expectedResult = service.addFinalUserToCollectionIfMissing([], null, finalUser, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(finalUser);
      });

      it('should return initial array if no FinalUser is added', () => {
        const finalUserCollection: IFinalUser[] = [sampleWithRequiredData];
        expectedResult = service.addFinalUserToCollectionIfMissing(finalUserCollection, undefined, null);
        expect(expectedResult).toEqual(finalUserCollection);
      });
    });

    describe('compareFinalUser', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareFinalUser(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareFinalUser(entity1, entity2);
        const compareResult2 = service.compareFinalUser(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareFinalUser(entity1, entity2);
        const compareResult2 = service.compareFinalUser(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareFinalUser(entity1, entity2);
        const compareResult2 = service.compareFinalUser(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
