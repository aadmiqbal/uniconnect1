import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
//import displayFeedBackend from '';
//declare function greet(): void;
declare function greet(appUsers: any[]): void;
//hello
@Component({
  selector: 'jhi-connections-feed',
  templateUrl: './connections-feed.component.html',
  styleUrls: ['./connections-feed.component.scss'],
})
export class ConnectionsFeedComponent implements OnInit {
  /* myScriptElement: HTMLScriptElement; */
  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<any[]>('/api/app-users').subscribe(appUsers => {
      greet(appUsers);
    });
  }
}
