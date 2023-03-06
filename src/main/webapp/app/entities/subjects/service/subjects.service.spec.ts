import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ISubjects } from '../subjects.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../subjects.test-samples';

import { SubjectsService } from './subjects.service';

const requireRestSample: ISubjects = {
  ...sampleWithRequiredData,
};

describe('Subjects Service', () => {
  let service: SubjectsService;
  let httpMock: HttpTestingController;
  let expectedResult: ISubjects | ISubjects[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(SubjectsService);
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

    it('should create a Subjects', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const subjects = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(subjects).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Subjects', () => {
      const subjects = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(subjects).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Subjects', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Subjects', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Subjects', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addSubjectsToCollectionIfMissing', () => {
      it('should add a Subjects to an empty array', () => {
        const subjects: ISubjects = sampleWithRequiredData;
        expectedResult = service.addSubjectsToCollectionIfMissing([], subjects);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(subjects);
      });

      it('should not add a Subjects to an array that contains it', () => {
        const subjects: ISubjects = sampleWithRequiredData;
        const subjectsCollection: ISubjects[] = [
          {
            ...subjects,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addSubjectsToCollectionIfMissing(subjectsCollection, subjects);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Subjects to an array that doesn't contain it", () => {
        const subjects: ISubjects = sampleWithRequiredData;
        const subjectsCollection: ISubjects[] = [sampleWithPartialData];
        expectedResult = service.addSubjectsToCollectionIfMissing(subjectsCollection, subjects);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(subjects);
      });

      it('should add only unique Subjects to an array', () => {
        const subjectsArray: ISubjects[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const subjectsCollection: ISubjects[] = [sampleWithRequiredData];
        expectedResult = service.addSubjectsToCollectionIfMissing(subjectsCollection, ...subjectsArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const subjects: ISubjects = sampleWithRequiredData;
        const subjects2: ISubjects = sampleWithPartialData;
        expectedResult = service.addSubjectsToCollectionIfMissing([], subjects, subjects2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(subjects);
        expect(expectedResult).toContain(subjects2);
      });

      it('should accept null and undefined values', () => {
        const subjects: ISubjects = sampleWithRequiredData;
        expectedResult = service.addSubjectsToCollectionIfMissing([], null, subjects, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(subjects);
      });

      it('should return initial array if no Subjects is added', () => {
        const subjectsCollection: ISubjects[] = [sampleWithRequiredData];
        expectedResult = service.addSubjectsToCollectionIfMissing(subjectsCollection, undefined, null);
        expect(expectedResult).toEqual(subjectsCollection);
      });
    });

    describe('compareSubjects', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareSubjects(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareSubjects(entity1, entity2);
        const compareResult2 = service.compareSubjects(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareSubjects(entity1, entity2);
        const compareResult2 = service.compareSubjects(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareSubjects(entity1, entity2);
        const compareResult2 = service.compareSubjects(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
