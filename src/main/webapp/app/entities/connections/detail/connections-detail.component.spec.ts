import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ConnectionsDetailComponent } from './connections-detail.component';

describe('Connections Management Detail Component', () => {
  let comp: ConnectionsDetailComponent;
  let fixture: ComponentFixture<ConnectionsDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConnectionsDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ connections: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ConnectionsDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ConnectionsDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load connections on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.connections).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
