import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IModuleLink } from '../module-link.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../module-link.test-samples';

import { ModuleLinkService } from './module-link.service';

const requireRestSample: IModuleLink = {
  ...sampleWithRequiredData,
};

describe('ModuleLink Service', () => {
  let service: ModuleLinkService;
  let httpMock: HttpTestingController;
  let expectedResult: IModuleLink | IModuleLink[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ModuleLinkService);
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

    it('should create a ModuleLink', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const moduleLink = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(moduleLink).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a ModuleLink', () => {
      const moduleLink = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(moduleLink).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a ModuleLink', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of ModuleLink', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a ModuleLink', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addModuleLinkToCollectionIfMissing', () => {
      it('should add a ModuleLink to an empty array', () => {
        const moduleLink: IModuleLink = sampleWithRequiredData;
        expectedResult = service.addModuleLinkToCollectionIfMissing([], moduleLink);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(moduleLink);
      });

      it('should not add a ModuleLink to an array that contains it', () => {
        const moduleLink: IModuleLink = sampleWithRequiredData;
        const moduleLinkCollection: IModuleLink[] = [
          {
            ...moduleLink,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addModuleLinkToCollectionIfMissing(moduleLinkCollection, moduleLink);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a ModuleLink to an array that doesn't contain it", () => {
        const moduleLink: IModuleLink = sampleWithRequiredData;
        const moduleLinkCollection: IModuleLink[] = [sampleWithPartialData];
        expectedResult = service.addModuleLinkToCollectionIfMissing(moduleLinkCollection, moduleLink);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(moduleLink);
      });

      it('should add only unique ModuleLink to an array', () => {
        const moduleLinkArray: IModuleLink[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const moduleLinkCollection: IModuleLink[] = [sampleWithRequiredData];
        expectedResult = service.addModuleLinkToCollectionIfMissing(moduleLinkCollection, ...moduleLinkArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const moduleLink: IModuleLink = sampleWithRequiredData;
        const moduleLink2: IModuleLink = sampleWithPartialData;
        expectedResult = service.addModuleLinkToCollectionIfMissing([], moduleLink, moduleLink2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(moduleLink);
        expect(expectedResult).toContain(moduleLink2);
      });

      it('should accept null and undefined values', () => {
        const moduleLink: IModuleLink = sampleWithRequiredData;
        expectedResult = service.addModuleLinkToCollectionIfMissing([], null, moduleLink, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(moduleLink);
      });

      it('should return initial array if no ModuleLink is added', () => {
        const moduleLinkCollection: IModuleLink[] = [sampleWithRequiredData];
        expectedResult = service.addModuleLinkToCollectionIfMissing(moduleLinkCollection, undefined, null);
        expect(expectedResult).toEqual(moduleLinkCollection);
      });
    });

    describe('compareModuleLink', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareModuleLink(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareModuleLink(entity1, entity2);
        const compareResult2 = service.compareModuleLink(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareModuleLink(entity1, entity2);
        const compareResult2 = service.compareModuleLink(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareModuleLink(entity1, entity2);
        const compareResult2 = service.compareModuleLink(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
