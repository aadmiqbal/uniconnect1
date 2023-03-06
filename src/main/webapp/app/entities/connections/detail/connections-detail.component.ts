import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IConnections } from '../connections.model';

@Component({
  selector: 'jhi-connections-detail',
  templateUrl: './connections-detail.component.html',
})
export class ConnectionsDetailComponent implements OnInit {
  connections: IConnections | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ connections }) => {
      this.connections = connections;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
