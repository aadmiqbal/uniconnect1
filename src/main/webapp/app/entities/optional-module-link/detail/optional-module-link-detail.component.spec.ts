import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { OptionalModuleLinkDetailComponent } from './optional-module-link-detail.component';

describe('OptionalModuleLink Management Detail Component', () => {
  let comp: OptionalModuleLinkDetailComponent;
  let fixture: ComponentFixture<OptionalModuleLinkDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OptionalModuleLinkDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ optionalModuleLink: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(OptionalModuleLinkDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(OptionalModuleLinkDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load optionalModuleLink on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.optionalModuleLink).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
