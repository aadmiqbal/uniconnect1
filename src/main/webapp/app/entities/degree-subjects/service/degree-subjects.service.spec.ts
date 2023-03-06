import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IDegreeSubjects } from '../degree-subjects.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../degree-subjects.test-samples';

import { DegreeSubjectsService } from './degree-subjects.service';

const requireRestSample: IDegreeSubjects = {
  ...sampleWithRequiredData,
};

describe('DegreeSubjects Service', () => {
  let service: DegreeSubjectsService;
  let httpMock: HttpTestingController;
  let expectedResult: IDegreeSubjects | IDegreeSubjects[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(DegreeSubjectsService);
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

    it('should create a DegreeSubjects', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const degreeSubjects = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(degreeSubjects).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a DegreeSubjects', () => {
      const degreeSubjects = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(degreeSubjects).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a DegreeSubjects', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of DegreeSubjects', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a DegreeSubjects', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addDegreeSubjectsToCollectionIfMissing', () => {
      it('should add a DegreeSubjects to an empty array', () => {
        const degreeSubjects: IDegreeSubjects = sampleWithRequiredData;
        expectedResult = service.addDegreeSubjectsToCollectionIfMissing([], degreeSubjects);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(degreeSubjects);
      });

      it('should not add a DegreeSubjects to an array that contains it', () => {
        const degreeSubjects: IDegreeSubjects = sampleWithRequiredData;
        const degreeSubjectsCollection: IDegreeSubjects[] = [
          {
            ...degreeSubjects,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addDegreeSubjectsToCollectionIfMissing(degreeSubjectsCollection, degreeSubjects);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a DegreeSubjects to an array that doesn't contain it", () => {
        const degreeSubjects: IDegreeSubjects = sampleWithRequiredData;
        const degreeSubjectsCollection: IDegreeSubjects[] = [sampleWithPartialData];
        expectedResult = service.addDegreeSubjectsToCollectionIfMissing(degreeSubjectsCollection, degreeSubjects);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(degreeSubjects);
      });

      it('should add only unique DegreeSubjects to an array', () => {
        const degreeSubjectsArray: IDegreeSubjects[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const degreeSubjectsCollection: IDegreeSubjects[] = [sampleWithRequiredData];
        expectedResult = service.addDegreeSubjectsToCollectionIfMissing(degreeSubjectsCollection, ...degreeSubjectsArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const degreeSubjects: IDegreeSubjects = sampleWithRequiredData;
        const degreeSubjects2: IDegreeSubjects = sampleWithPartialData;
        expectedResult = service.addDegreeSubjectsToCollectionIfMissing([], degreeSubjects, degreeSubjects2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(degreeSubjects);
        expect(expectedResult).toContain(degreeSubjects2);
      });

      it('should accept null and undefined values', () => {
        const degreeSubjects: IDegreeSubjects = sampleWithRequiredData;
        expectedResult = service.addDegreeSubjectsToCollectionIfMissing([], null, degreeSubjects, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(degreeSubjects);
      });

      it('should return initial array if no DegreeSubjects is added', () => {
        const degreeSubjectsCollection: IDegreeSubjects[] = [sampleWithRequiredData];
        expectedResult = service.addDegreeSubjectsToCollectionIfMissing(degreeSubjectsCollection, undefined, null);
        expect(expectedResult).toEqual(degreeSubjectsCollection);
      });
    });

    describe('compareDegreeSubjects', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareDegreeSubjects(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareDegreeSubjects(entity1, entity2);
        const compareResult2 = service.compareDegreeSubjects(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareDegreeSubjects(entity1, entity2);
        const compareResult2 = service.compareDegreeSubjects(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareDegreeSubjects(entity1, entity2);
        const compareResult2 = service.compareDegreeSubjects(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
