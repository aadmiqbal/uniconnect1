import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IFriendship } from '../friendship.model';

@Component({
  selector: 'jhi-friendship-detail',
  templateUrl: './friendship-detail.component.html',
})
export class FriendshipDetailComponent implements OnInit {
  friendship: IFriendship | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ friendship }) => {
      this.friendship = friendship;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
