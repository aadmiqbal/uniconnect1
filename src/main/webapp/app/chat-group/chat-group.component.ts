import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

declare function writeMessages(messages: any[]): void;
@Component({
  selector: 'jhi-chat-group',
  templateUrl: './chat-group.component.html',
  styleUrls: ['./chat-group.component.scss'],
})
export class ChatGroupComponent implements OnInit {
  constructor(private http: HttpClient) {}
  ngOnInit(): void {
    writeMessages([]);
  }
}
