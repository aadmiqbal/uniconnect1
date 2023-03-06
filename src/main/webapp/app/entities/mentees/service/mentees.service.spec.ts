import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IMentees } from '../mentees.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../mentees.test-samples';

import { MenteesService } from './mentees.service';

const requireRestSample: IMentees = {
  ...sampleWithRequiredData,
};

describe('Mentees Service', () => {
  let service: MenteesService;
  let httpMock: HttpTestingController;
  let expectedResult: IMentees | IMentees[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(MenteesService);
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

    it('should create a Mentees', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const mentees = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(mentees).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Mentees', () => {
      const mentees = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(mentees).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Mentees', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Mentees', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Mentees', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addMenteesToCollectionIfMissing', () => {
      it('should add a Mentees to an empty array', () => {
        const mentees: IMentees = sampleWithRequiredData;
        expectedResult = service.addMenteesToCollectionIfMissing([], mentees);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(mentees);
      });

      it('should not add a Mentees to an array that contains it', () => {
        const mentees: IMentees = sampleWithRequiredData;
        const menteesCollection: IMentees[] = [
          {
            ...mentees,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addMenteesToCollectionIfMissing(menteesCollection, mentees);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Mentees to an array that doesn't contain it", () => {
        const mentees: IMentees = sampleWithRequiredData;
        const menteesCollection: IMentees[] = [sampleWithPartialData];
        expectedResult = service.addMenteesToCollectionIfMissing(menteesCollection, mentees);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(mentees);
      });

      it('should add only unique Mentees to an array', () => {
        const menteesArray: IMentees[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const menteesCollection: IMentees[] = [sampleWithRequiredData];
        expectedResult = service.addMenteesToCollectionIfMissing(menteesCollection, ...menteesArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const mentees: IMentees = sampleWithRequiredData;
        const mentees2: IMentees = sampleWithPartialData;
        expectedResult = service.addMenteesToCollectionIfMissing([], mentees, mentees2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(mentees);
        expect(expectedResult).toContain(mentees2);
      });

      it('should accept null and undefined values', () => {
        const mentees: IMentees = sampleWithRequiredData;
        expectedResult = service.addMenteesToCollectionIfMissing([], null, mentees, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(mentees);
      });

      it('should return initial array if no Mentees is added', () => {
        const menteesCollection: IMentees[] = [sampleWithRequiredData];
        expectedResult = service.addMenteesToCollectionIfMissing(menteesCollection, undefined, null);
        expect(expectedResult).toEqual(menteesCollection);
      });
    });

    describe('compareMentees', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareMentees(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareMentees(entity1, entity2);
        const compareResult2 = service.compareMentees(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareMentees(entity1, entity2);
        const compareResult2 = service.compareMentees(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareMentees(entity1, entity2);
        const compareResult2 = service.compareMentees(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
