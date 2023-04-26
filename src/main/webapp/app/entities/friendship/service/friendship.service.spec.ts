import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IFriendship } from '../friendship.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../friendship.test-samples';

import { FriendshipService } from './friendship.service';

const requireRestSample: IFriendship = {
  ...sampleWithRequiredData,
};

describe('Friendship Service', () => {
  let service: FriendshipService;
  let httpMock: HttpTestingController;
  let expectedResult: IFriendship | IFriendship[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(FriendshipService);
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

    it('should create a Friendship', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const friendship = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(friendship).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Friendship', () => {
      const friendship = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(friendship).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Friendship', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Friendship', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Friendship', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addFriendshipToCollectionIfMissing', () => {
      it('should add a Friendship to an empty array', () => {
        const friendship: IFriendship = sampleWithRequiredData;
        expectedResult = service.addFriendshipToCollectionIfMissing([], friendship);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(friendship);
      });

      it('should not add a Friendship to an array that contains it', () => {
        const friendship: IFriendship = sampleWithRequiredData;
        const friendshipCollection: IFriendship[] = [
          {
            ...friendship,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addFriendshipToCollectionIfMissing(friendshipCollection, friendship);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Friendship to an array that doesn't contain it", () => {
        const friendship: IFriendship = sampleWithRequiredData;
        const friendshipCollection: IFriendship[] = [sampleWithPartialData];
        expectedResult = service.addFriendshipToCollectionIfMissing(friendshipCollection, friendship);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(friendship);
      });

      it('should add only unique Friendship to an array', () => {
        const friendshipArray: IFriendship[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const friendshipCollection: IFriendship[] = [sampleWithRequiredData];
        expectedResult = service.addFriendshipToCollectionIfMissing(friendshipCollection, ...friendshipArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const friendship: IFriendship = sampleWithRequiredData;
        const friendship2: IFriendship = sampleWithPartialData;
        expectedResult = service.addFriendshipToCollectionIfMissing([], friendship, friendship2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(friendship);
        expect(expectedResult).toContain(friendship2);
      });

      it('should accept null and undefined values', () => {
        const friendship: IFriendship = sampleWithRequiredData;
        expectedResult = service.addFriendshipToCollectionIfMissing([], null, friendship, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(friendship);
      });

      it('should return initial array if no Friendship is added', () => {
        const friendshipCollection: IFriendship[] = [sampleWithRequiredData];
        expectedResult = service.addFriendshipToCollectionIfMissing(friendshipCollection, undefined, null);
        expect(expectedResult).toEqual(friendshipCollection);
      });
    });

    describe('compareFriendship', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareFriendship(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareFriendship(entity1, entity2);
        const compareResult2 = service.compareFriendship(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareFriendship(entity1, entity2);
        const compareResult2 = service.compareFriendship(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareFriendship(entity1, entity2);
        const compareResult2 = service.compareFriendship(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
