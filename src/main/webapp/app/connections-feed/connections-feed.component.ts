import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
declare function greet(userExtras: any[]): void;
@Component({
  selector: 'jhi-connections-feed',
  templateUrl: './connections-feed.component.html',
  styleUrls: ['./connections-feed.component.scss'],
})
export class ConnectionsFeedComponent implements OnInit {
  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<any[]>('/api/user-extras').subscribe(userExtras => {
      greet(userExtras);
    });
  }
}
