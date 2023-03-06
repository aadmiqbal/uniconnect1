import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IModuleLink } from '../module-link.model';

@Component({
  selector: 'jhi-module-link-detail',
  templateUrl: './module-link-detail.component.html',
})
export class ModuleLinkDetailComponent implements OnInit {
  moduleLink: IModuleLink | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ moduleLink }) => {
      this.moduleLink = moduleLink;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
