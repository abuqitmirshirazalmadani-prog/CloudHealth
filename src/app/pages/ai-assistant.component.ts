import { Component, inject, signal } from '@angular/core';
import { AiService } from '../ai.service';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-ai-assistant',
  standalone: true,
  imports: [MatIconModule, FormsModule],
  template: `
    <div class="p-4 md:p-8 max-w-3xl mx-auto h-[calc(100vh-80px)] md:h-screen flex flex-col">
      <header class="mb-6 flex-shrink-0">
        <h1 class="text-2xl md:text-3xl font-semibold text-slate-900 flex items-center gap-3">
          <div class="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
            <mat-icon>smart_toy</mat-icon>
          </div>
          Health Assistant
        </h1>
        <p class="text-slate-500 mt-2">Ask me anything about your health, symptoms, or wellness tips.</p>
      </header>

      <div class="flex-1 overflow-y-auto bg-white rounded-3xl border border-slate-200 shadow-sm p-4 md:p-6 mb-4 flex flex-col gap-4">
        @if (messages().length === 0) {
          <div class="flex-1 flex flex-col items-center justify-center text-center text-slate-400">
            <mat-icon class="text-6xl mb-4 opacity-20">forum</mat-icon>
            <p class="max-w-xs">I'm here to help you understand your health better. Try asking about a symptom or a general health tip.</p>
            <div class="mt-6 flex flex-wrap justify-center gap-2">
              <button (click)="prompt = 'What are some natural ways to lower blood pressure?'; sendMessage()" class="bg-slate-50 hover:bg-slate-100 text-slate-600 px-4 py-2 rounded-full text-sm transition-colors border border-slate-200">
                Lower blood pressure
              </button>
              <button (click)="prompt = 'I have a mild headache and feel tired. What should I do?'; sendMessage()" class="bg-slate-50 hover:bg-slate-100 text-slate-600 px-4 py-2 rounded-full text-sm transition-colors border border-slate-200">
                Headache & fatigue
              </button>
            </div>
          </div>
        }

        @for (msg of messages(); track $index) {
          <div class="flex gap-4 max-w-[85%]" [class.ml-auto]="msg.role === 'user'">
            @if (msg.role === 'ai') {
              <div class="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-1">
                <mat-icon class="text-[18px] w-[18px] h-[18px]">smart_toy</mat-icon>
              </div>
            }
            <div class="p-4 rounded-2xl" [class.bg-emerald-600]="msg.role === 'user'" [class.text-white]="msg.role === 'user'" [class.bg-slate-100]="msg.role === 'ai'" [class.text-slate-800]="msg.role === 'ai'">
              <p class="whitespace-pre-wrap leading-relaxed">{{ msg.content }}</p>
            </div>
          </div>
        }
        
        @if (isLoading()) {
          <div class="flex gap-4 max-w-[85%]">
            <div class="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-1">
              <mat-icon class="text-[18px] w-[18px] h-[18px] animate-spin">sync</mat-icon>
            </div>
            <div class="p-4 rounded-2xl bg-slate-100 text-slate-500 flex items-center gap-1">
              <div class="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
              <div class="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
              <div class="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
            </div>
          </div>
        }
      </div>

      <div class="flex-shrink-0 bg-white rounded-2xl border border-slate-200 p-2 flex items-end shadow-sm">
        <textarea 
          [(ngModel)]="prompt" 
          (keydown.enter)="onEnter($event)"
          placeholder="Type your health question..." 
          class="flex-1 bg-transparent border-none focus:ring-0 resize-none max-h-32 min-h-[44px] p-3 text-slate-800"
          rows="1"
        ></textarea>
        <button 
          (click)="sendMessage()" 
          [disabled]="!prompt.trim() || isLoading()"
          class="w-11 h-11 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0 m-1"
        >
          <mat-icon>send</mat-icon>
        </button>
      </div>
      <p class="text-center text-xs text-slate-400 mt-3 flex-shrink-0">
        AI can make mistakes. Always consult a doctor for medical advice.
      </p>
    </div>
  `
})
export class AiAssistantComponent {
  private aiService = inject(AiService);

  prompt = '';
  messages = signal<{role: 'user'|'ai', content: string}[]>([]);
  isLoading = signal(false);

  onEnter(event: Event) {
    event.preventDefault();
    this.sendMessage();
  }

  async sendMessage() {
    if (!this.prompt.trim() || this.isLoading()) return;

    const userText = this.prompt.trim();
    this.prompt = '';
    
    this.messages.update(m => [...m, { role: 'user', content: userText }]);
    this.isLoading.set(true);

    const response = await this.aiService.getHealthGuidance(userText);
    
    this.messages.update(m => [...m, { role: 'ai', content: response }]);
    this.isLoading.set(false);
  }
}
