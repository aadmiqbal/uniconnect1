import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IMentors } from '../mentors.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../mentors.test-samples';

import { MentorsService } from './mentors.service';

const requireRestSample: IMentors = {
  ...sampleWithRequiredData,
};

describe('Mentors Service', () => {
  let service: MentorsService;
  let httpMock: HttpTestingController;
  let expectedResult: IMentors | IMentors[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(MentorsService);
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

    it('should create a Mentors', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const mentors = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(mentors).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Mentors', () => {
      const mentors = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(mentors).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Mentors', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Mentors', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Mentors', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addMentorsToCollectionIfMissing', () => {
      it('should add a Mentors to an empty array', () => {
        const mentors: IMentors = sampleWithRequiredData;
        expectedResult = service.addMentorsToCollectionIfMissing([], mentors);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(mentors);
      });

      it('should not add a Mentors to an array that contains it', () => {
        const mentors: IMentors = sampleWithRequiredData;
        const mentorsCollection: IMentors[] = [
          {
            ...mentors,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addMentorsToCollectionIfMissing(mentorsCollection, mentors);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Mentors to an array that doesn't contain it", () => {
        const mentors: IMentors = sampleWithRequiredData;
        const mentorsCollection: IMentors[] = [sampleWithPartialData];
        expectedResult = service.addMentorsToCollectionIfMissing(mentorsCollection, mentors);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(mentors);
      });

      it('should add only unique Mentors to an array', () => {
        const mentorsArray: IMentors[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const mentorsCollection: IMentors[] = [sampleWithRequiredData];
        expectedResult = service.addMentorsToCollectionIfMissing(mentorsCollection, ...mentorsArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const mentors: IMentors = sampleWithRequiredData;
        const mentors2: IMentors = sampleWithPartialData;
        expectedResult = service.addMentorsToCollectionIfMissing([], mentors, mentors2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(mentors);
        expect(expectedResult).toContain(mentors2);
      });

      it('should accept null and undefined values', () => {
        const mentors: IMentors = sampleWithRequiredData;
        expectedResult = service.addMentorsToCollectionIfMissing([], null, mentors, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(mentors);
      });

      it('should return initial array if no Mentors is added', () => {
        const mentorsCollection: IMentors[] = [sampleWithRequiredData];
        expectedResult = service.addMentorsToCollectionIfMissing(mentorsCollection, undefined, null);
        expect(expectedResult).toEqual(mentorsCollection);
      });
    });

    describe('compareMentors', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareMentors(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareMentors(entity1, entity2);
        const compareResult2 = service.compareMentors(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareMentors(entity1, entity2);
        const compareResult2 = service.compareMentors(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareMentors(entity1, entity2);
        const compareResult2 = service.compareMentors(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
