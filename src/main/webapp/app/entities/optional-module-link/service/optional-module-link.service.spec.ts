import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IOptionalModuleLink } from '../optional-module-link.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../optional-module-link.test-samples';

import { OptionalModuleLinkService } from './optional-module-link.service';

const requireRestSample: IOptionalModuleLink = {
  ...sampleWithRequiredData,
};

describe('OptionalModuleLink Service', () => {
  let service: OptionalModuleLinkService;
  let httpMock: HttpTestingController;
  let expectedResult: IOptionalModuleLink | IOptionalModuleLink[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(OptionalModuleLinkService);
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

    it('should create a OptionalModuleLink', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const optionalModuleLink = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(optionalModuleLink).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a OptionalModuleLink', () => {
      const optionalModuleLink = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(optionalModuleLink).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a OptionalModuleLink', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of OptionalModuleLink', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a OptionalModuleLink', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addOptionalModuleLinkToCollectionIfMissing', () => {
      it('should add a OptionalModuleLink to an empty array', () => {
        const optionalModuleLink: IOptionalModuleLink = sampleWithRequiredData;
        expectedResult = service.addOptionalModuleLinkToCollectionIfMissing([], optionalModuleLink);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(optionalModuleLink);
      });

      it('should not add a OptionalModuleLink to an array that contains it', () => {
        const optionalModuleLink: IOptionalModuleLink = sampleWithRequiredData;
        const optionalModuleLinkCollection: IOptionalModuleLink[] = [
          {
            ...optionalModuleLink,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addOptionalModuleLinkToCollectionIfMissing(optionalModuleLinkCollection, optionalModuleLink);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a OptionalModuleLink to an array that doesn't contain it", () => {
        const optionalModuleLink: IOptionalModuleLink = sampleWithRequiredData;
        const optionalModuleLinkCollection: IOptionalModuleLink[] = [sampleWithPartialData];
        expectedResult = service.addOptionalModuleLinkToCollectionIfMissing(optionalModuleLinkCollection, optionalModuleLink);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(optionalModuleLink);
      });

      it('should add only unique OptionalModuleLink to an array', () => {
        const optionalModuleLinkArray: IOptionalModuleLink[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const optionalModuleLinkCollection: IOptionalModuleLink[] = [sampleWithRequiredData];
        expectedResult = service.addOptionalModuleLinkToCollectionIfMissing(optionalModuleLinkCollection, ...optionalModuleLinkArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const optionalModuleLink: IOptionalModuleLink = sampleWithRequiredData;
        const optionalModuleLink2: IOptionalModuleLink = sampleWithPartialData;
        expectedResult = service.addOptionalModuleLinkToCollectionIfMissing([], optionalModuleLink, optionalModuleLink2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(optionalModuleLink);
        expect(expectedResult).toContain(optionalModuleLink2);
      });

      it('should accept null and undefined values', () => {
        const optionalModuleLink: IOptionalModuleLink = sampleWithRequiredData;
        expectedResult = service.addOptionalModuleLinkToCollectionIfMissing([], null, optionalModuleLink, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(optionalModuleLink);
      });

      it('should return initial array if no OptionalModuleLink is added', () => {
        const optionalModuleLinkCollection: IOptionalModuleLink[] = [sampleWithRequiredData];
        expectedResult = service.addOptionalModuleLinkToCollectionIfMissing(optionalModuleLinkCollection, undefined, null);
        expect(expectedResult).toEqual(optionalModuleLinkCollection);
      });
    });

    describe('compareOptionalModuleLink', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareOptionalModuleLink(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareOptionalModuleLink(entity1, entity2);
        const compareResult2 = service.compareOptionalModuleLink(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareOptionalModuleLink(entity1, entity2);
        const compareResult2 = service.compareOptionalModuleLink(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareOptionalModuleLink(entity1, entity2);
        const compareResult2 = service.compareOptionalModuleLink(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
