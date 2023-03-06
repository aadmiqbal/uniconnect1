import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ModuleLinkDetailComponent } from './module-link-detail.component';

describe('ModuleLink Management Detail Component', () => {
  let comp: ModuleLinkDetailComponent;
  let fixture: ComponentFixture<ModuleLinkDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModuleLinkDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ moduleLink: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ModuleLinkDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ModuleLinkDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load moduleLink on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.moduleLink).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
