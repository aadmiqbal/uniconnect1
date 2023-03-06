import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IOptionalModuleLink } from '../optional-module-link.model';

@Component({
  selector: 'jhi-optional-module-link-detail',
  templateUrl: './optional-module-link-detail.component.html',
})
export class OptionalModuleLinkDetailComponent implements OnInit {
  optionalModuleLink: IOptionalModuleLink | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ optionalModuleLink }) => {
      this.optionalModuleLink = optionalModuleLink;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
