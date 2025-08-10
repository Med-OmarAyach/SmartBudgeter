// chat-widget.component.ts
import { Component, ElementRef, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'; // Import HttpHeaders
import { AuthService } from 'app/services/auth.service';
import { finalize } from 'rxjs/operators'; // Import finalize operator for cleaner loading state management

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
  isTyping: boolean = false; // Use this to show loading indicator

  @ViewChild('messagesEnd') private messagesEndRef!: ElementRef;

  constructor(private http: HttpClient, private authService: AuthService) {} // Keep existing injection

  scrollToBottom() {
    setTimeout(() => {
      this.messagesEndRef?.nativeElement?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  }

  async handleSend() {
    if (!this.input.trim()) return;

    const userMessageText = this.input.trim();
    const newUserMessage: ChatMessage = { sender: 'user', text: userMessageText };
    this.messages.push(newUserMessage);
    this.input = ''; // Clear input immediately
    this.isTyping = true; // Show typing indicator
    this.scrollToBottom();

    try {
      // --- 1. Get the User ID from AuthService ---
      const userId = this.authService.getCurrentUserId();
      if (userId === null) {
        console.error('ChatWidget: User ID not found. User might not be logged in.');
        this.messages.push({ sender: 'bot', text: 'Error: Vous devez être connecté pour utiliser le chat.' });
        return; // Stop execution
      }
      // --- End of User ID retrieval ---

      // --- 2. Prepare the request payload ---
      const requestBody = {
        userId: userId, // Send the numeric user ID
        text: userMessageText,
        sender: 'user',
      };
      // --- End of payload preparation ---

      // --- 3. Get Authentication Headers ---
      // Use AuthService to get the HttpHeaders with the Authorization token
      const headers: HttpHeaders = this.authService.getAuthHeaders(); // Assumes getAuthHeaders returns HttpHeaders
      // --- End of header retrieval ---

      // --- 4. Make the HTTP POST request with headers ---
      // Use .pipe(finalize(...)) for cleaner isTyping state management
      this.http.post<any>('http://localhost:8083/api/chat', requestBody, { headers }) // Include headers
        .pipe(
          finalize(() => {
            // This block runs whether the request succeeds or fails
            this.isTyping = false;
            this.scrollToBottom();
          })
        )
        .subscribe({
          next: (res: any) => {
            // --- 5. Handle successful response ---
            console.log('Chat response received:', res);
            // Assuming backend returns { text: "Bot's response" }
            if (res && res.text) {
              this.messages.push({ sender: 'bot', text: res.text });
            } else {
              console.warn('Chat response missing text:', res);
              this.messages.push({ sender: 'bot', text: 'Désolé, je n\'ai pas compris la réponse.' });
            }
            // --- End of success handling ---
          },
          error: (err) => {
            // --- 6. Handle HTTP errors ---
            console.error('Error sending message to chat API:', err);
            let errorMessage = 'Erreur lors de la communication avec le serveur.';
            if (err.status === 401) {
              errorMessage = 'Erreur d\'authentification. Veuillez vous reconnecter.';
              // Consider triggering logout: this.authService.logout();
            } else if (err.status === 403) {
              errorMessage = 'Accès refusé. Vous n\'avez peut-être pas l\'autorisation.';
            } else if (err.status === 0) {
              errorMessage = 'Erreur réseau ou serveur injoignable.';
            }
            this.messages.push({ sender: 'bot', text: errorMessage });
            // --- End of error handling ---
          }
        });

    } catch (err) {
      // --- 7. Handle unexpected client-side errors ---
      console.error('Unexpected error in handleSend:', err);
      this.isTyping = false; // Ensure typing indicator is hidden on unexpected errors
      this.messages.push({ sender: 'bot', text: 'Une erreur inattendue s\'est produite.' });
      this.scrollToBottom();
      // --- End of client-side error handling ---
    }
    // Note: isTyping and scrollToBottom are now handled by finalize()
  }
}