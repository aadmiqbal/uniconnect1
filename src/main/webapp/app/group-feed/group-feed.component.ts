import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

declare function greet1(finalUsers: any[]): void;

@Component({
  selector: 'jhi-group-feed',
  templateUrl: './group-feed.component.html',
  styleUrls: ['./group-feed.component.scss'],
})
export class GroupFeedComponent implements OnInit {
  /* myScriptElement: HTMLScriptElement; */
  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<any[]>('/api/final-users').subscribe(finalUsers => {
      greet1(finalUsers);
    });
  }
}
