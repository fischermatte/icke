import { AfterViewChecked, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ChatEntry, ChatMessage, ChatMessageType, ChatUser } from './chat.model';
import { ChatService } from './chat.service';
import { v4 as uuid } from 'uuid';
import { PushService } from './push/push.service';
import { AlertService } from '../core/alert/alert.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit, AfterViewChecked {
  @ViewChild('messagesContainer', { static: true })
  private messagesContainer: ElementRef;
  @ViewChild('messageInput', { static: false })
  private messageInput: ElementRef;
  user: ChatUser;
  message: string;
  messages: ChatEntry[];
  pushEnabled = false;

  constructor(private chatService: ChatService, private pushService: PushService, private alertService: AlertService) {}

  ngOnInit() {
    this.chatService.getUser().subscribe(user => (this.user = user));
    this.messages = this.chatService.getMessages();
    this.scrollToBottom();
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
    if (this.messageInput) {
      this.messageInput.nativeElement.focus();
    }
  }

  public send() {
    if (this.message) {
      this.chatService.send(new ChatMessage(this.message, this.user, ChatMessageType.CHAT));
      this.message = '';
    }
  }

  public loginWithUsername(username: string) {
    if (!username || !username.trim()) {
      return;
    }
    this.chatService.login(this.createUser(username));
  }

  public togglePush(checked: boolean): void {
    setTimeout(() => {
      if (checked) {
        this.enablePush();
      } else {
        this.disablePush();
      }
    });
  }

  private enablePush(): Promise<void> {
    return this.pushService.register().then(
      () => {
        this.pushEnabled = true;
      },
      error => {
        this.pushEnabled = false;
        console.log(error);
        this.alertService.addError('Failed to enable push notifications');
      },
    );
  }

  private disablePush(): Promise<void> {
    return this.pushService.unregister().then(
      () => {
        this.pushEnabled = false;
      },
      error => {
        console.log(error);
        this.pushEnabled = true;
      },
    );
  }

  private createUser(username: string) {
    return {
      name: username,
      id: uuid(),
    };
  }

  private scrollToBottom(): void {
    try {
      this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
    } catch (err) {}
  }
}
