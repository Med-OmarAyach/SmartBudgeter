import { Component, ElementRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
}

@Component({
  selector: 'app-chat-widget',
  templateUrl: './chat-widget.component.html',
  styleUrls: ['./chat-widget.component.css']
})
export class ChatWidgetComponent {
  messages: ChatMessage[] = [];
  input: string = '';
  open: boolean = false;
  isTyping: boolean = false;

  @ViewChild('messagesEnd') private messagesEndRef!: ElementRef;

  constructor(private http: HttpClient) {}

  scrollToBottom() {
    setTimeout(() => {
      this.messagesEndRef?.nativeElement?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  }

  async handleSend() {
    if (!this.input.trim()) return;

    const newUserMessage: ChatMessage = { sender: 'user', text: this.input };
    this.messages.push(newUserMessage);
    this.input = '';
    this.isTyping = true;
    this.scrollToBottom();

    try {
      const res: any = await this.http.post('http://localhost:8083/api/chat', {
        text: newUserMessage.text,
        sender: 'user',
      }).toPromise();

      this.messages.push({ sender: 'bot', text: res.text });
    } catch {
      this.messages.push({ sender: 'bot', text: 'Error reaching server.' });
    }

    this.isTyping = false;
    this.scrollToBottom();
  }
}
