import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MessageService } from '../../app/entities/message/service/message.service';
import { HttpResponse } from '@angular/common/http';
import { IMessage, NewMessage } from '../entities/message/message.model';
import dayjs from 'dayjs/esm';
import { ActivatedRoute } from '@angular/router';

declare function writeMessages(messages: any[]): void;

@Component({
  selector: 'jhi-chat-group',
  templateUrl: './chat-group.component.html',
  styleUrls: ['./chat-group.component.scss'],
})
export class ChatGroupComponent implements OnInit {
  messages: IMessage[] = [];
  receiverId!: number;
  currentUserId!: number;

  constructor(private route: ActivatedRoute, private messageService: MessageService, private http: HttpClient) {}

  async ngOnInit(): Promise<void> {
    try {
      const account = await this.http.get<any>('/api/account').toPromise();
      this.currentUserId = account.id;
      this.route.params.subscribe(params => {
        this.receiverId = +params['recipientId'];
        this.loadMessages();
      });
    } catch (error) {
      console.error('Error fetching account or final users:', error);
    }
    (window as any).userId = this.currentUserId;
  }

  loadMessages(): void {
    this.messageService.getMessagesBetween(this.currentUserId, this.receiverId).subscribe((response: HttpResponse<IMessage[]>) => {
      writeMessages(response.body || []);
      setTimeout(() => {
        var container = document.getElementById('messages');
        container!.scrollTop = container!.scrollHeight;
      }, 1);
    });
  }

  sendMessage(message: string): void {
    if (message.trim() === '') {
      return;
    }

    const newMessage: NewMessage = {
      id: null,
      senderId: this.currentUserId,
      recieverId: this.receiverId,
      content: message,
      timestamp: dayjs(),
    };

    this.messageService.create(newMessage).subscribe(
      response => {
        console.log('Message sent:', response.body);
        // Add the new message to the messages array
        if (response.body) {
          this.messages.push(response.body);
        }
      },
      error => {
        console.error('Error sending message:', error);
      }
    );
  }
}
