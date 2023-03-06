import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IDegrees } from '../degrees.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../degrees.test-samples';

import { DegreesService } from './degrees.service';

const requireRestSample: IDegrees = {
  ...sampleWithRequiredData,
};

describe('Degrees Service', () => {
  let service: DegreesService;
  let httpMock: HttpTestingController;
  let expectedResult: IDegrees | IDegrees[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(DegreesService);
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

    it('should create a Degrees', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const degrees = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(degrees).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Degrees', () => {
      const degrees = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(degrees).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Degrees', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Degrees', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Degrees', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addDegreesToCollectionIfMissing', () => {
      it('should add a Degrees to an empty array', () => {
        const degrees: IDegrees = sampleWithRequiredData;
        expectedResult = service.addDegreesToCollectionIfMissing([], degrees);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(degrees);
      });

      it('should not add a Degrees to an array that contains it', () => {
        const degrees: IDegrees = sampleWithRequiredData;
        const degreesCollection: IDegrees[] = [
          {
            ...degrees,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addDegreesToCollectionIfMissing(degreesCollection, degrees);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Degrees to an array that doesn't contain it", () => {
        const degrees: IDegrees = sampleWithRequiredData;
        const degreesCollection: IDegrees[] = [sampleWithPartialData];
        expectedResult = service.addDegreesToCollectionIfMissing(degreesCollection, degrees);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(degrees);
      });

      it('should add only unique Degrees to an array', () => {
        const degreesArray: IDegrees[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const degreesCollection: IDegrees[] = [sampleWithRequiredData];
        expectedResult = service.addDegreesToCollectionIfMissing(degreesCollection, ...degreesArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const degrees: IDegrees = sampleWithRequiredData;
        const degrees2: IDegrees = sampleWithPartialData;
        expectedResult = service.addDegreesToCollectionIfMissing([], degrees, degrees2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(degrees);
        expect(expectedResult).toContain(degrees2);
      });

      it('should accept null and undefined values', () => {
        const degrees: IDegrees = sampleWithRequiredData;
        expectedResult = service.addDegreesToCollectionIfMissing([], null, degrees, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(degrees);
      });

      it('should return initial array if no Degrees is added', () => {
        const degreesCollection: IDegrees[] = [sampleWithRequiredData];
        expectedResult = service.addDegreesToCollectionIfMissing(degreesCollection, undefined, null);
        expect(expectedResult).toEqual(degreesCollection);
      });
    });

    describe('compareDegrees', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareDegrees(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareDegrees(entity1, entity2);
        const compareResult2 = service.compareDegrees(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareDegrees(entity1, entity2);
        const compareResult2 = service.compareDegrees(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareDegrees(entity1, entity2);
        const compareResult2 = service.compareDegrees(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
