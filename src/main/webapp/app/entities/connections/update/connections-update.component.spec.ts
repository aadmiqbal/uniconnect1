import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ConnectionsFormService } from './connections-form.service';
import { ConnectionsService } from '../service/connections.service';
import { IConnections } from '../connections.model';
import { IAppUsers } from 'app/entities/app-users/app-users.model';
import { AppUsersService } from 'app/entities/app-users/service/app-users.service';

import { ConnectionsUpdateComponent } from './connections-update.component';

describe('Connections Management Update Component', () => {
  let comp: ConnectionsUpdateComponent;
  let fixture: ComponentFixture<ConnectionsUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let connectionsFormService: ConnectionsFormService;
  let connectionsService: ConnectionsService;
  let appUsersService: AppUsersService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ConnectionsUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(ConnectionsUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ConnectionsUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    connectionsFormService = TestBed.inject(ConnectionsFormService);
    connectionsService = TestBed.inject(ConnectionsService);
    appUsersService = TestBed.inject(AppUsersService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call AppUsers query and add missing value', () => {
      const connections: IConnections = { id: 456 };
      const user1: IAppUsers = { id: 4866 };
      connections.user1 = user1;
      const user2: IAppUsers = { id: 3591 };
      connections.user2 = user2;

      const appUsersCollection: IAppUsers[] = [{ id: 69887 }];
      jest.spyOn(appUsersService, 'query').mockReturnValue(of(new HttpResponse({ body: appUsersCollection })));
      const additionalAppUsers = [user1, user2];
      const expectedCollection: IAppUsers[] = [...additionalAppUsers, ...appUsersCollection];
      jest.spyOn(appUsersService, 'addAppUsersToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ connections });
      comp.ngOnInit();

      expect(appUsersService.query).toHaveBeenCalled();
      expect(appUsersService.addAppUsersToCollectionIfMissing).toHaveBeenCalledWith(
        appUsersCollection,
        ...additionalAppUsers.map(expect.objectContaining)
      );
      expect(comp.appUsersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const connections: IConnections = { id: 456 };
      const user1: IAppUsers = { id: 96679 };
      connections.user1 = user1;
      const user2: IAppUsers = { id: 16999 };
      connections.user2 = user2;

      activatedRoute.data = of({ connections });
      comp.ngOnInit();

      expect(comp.appUsersSharedCollection).toContain(user1);
      expect(comp.appUsersSharedCollection).toContain(user2);
      expect(comp.connections).toEqual(connections);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IConnections>>();
      const connections = { id: 123 };
      jest.spyOn(connectionsFormService, 'getConnections').mockReturnValue(connections);
      jest.spyOn(connectionsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ connections });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: connections }));
      saveSubject.complete();

      // THEN
      expect(connectionsFormService.getConnections).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(connectionsService.update).toHaveBeenCalledWith(expect.objectContaining(connections));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IConnections>>();
      const connections = { id: 123 };
      jest.spyOn(connectionsFormService, 'getConnections').mockReturnValue({ id: null });
      jest.spyOn(connectionsService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ connections: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: connections }));
      saveSubject.complete();

      // THEN
      expect(connectionsFormService.getConnections).toHaveBeenCalled();
      expect(connectionsService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IConnections>>();
      const connections = { id: 123 };
      jest.spyOn(connectionsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ connections });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(connectionsService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareAppUsers', () => {
      it('Should forward to appUsersService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(appUsersService, 'compareAppUsers');
        comp.compareAppUsers(entity, entity2);
        expect(appUsersService.compareAppUsers).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
