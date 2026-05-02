import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../auth.service';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatIconModule, RouterLink],
  template: `
    <div class="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
      <div class="max-w-md w-full bg-white rounded-3xl shadow-sm border border-slate-100 p-8 text-center">
        <div class="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <mat-icon class="text-4xl w-10 h-10 flex items-center justify-center">favorite</mat-icon>
        </div>
        <h1 class="text-3xl font-sans font-semibold tracking-tight text-slate-900 mb-2">CloudHealth</h1>
        <p class="text-slate-500 mb-8">Your personal health companion. Secure, smart, and always accessible.</p>
        
        @if (error()) {
          <div class="mb-6 p-4 bg-red-50 text-red-700 rounded-xl text-sm border border-red-100">
            {{ error() }}
          </div>
        }

        <button 
          (click)="login()"
          [disabled]="isLoading()"
          class="w-full flex items-center justify-center gap-3 bg-slate-900 hover:bg-slate-800 text-white py-4 px-6 rounded-2xl font-medium transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
        >
          @if (isLoading()) {
            <mat-icon class="animate-spin">sync</mat-icon>
            Connecting...
          } @else {
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" class="w-5 h-5 bg-white rounded-full p-0.5" />
            Continue with Google
          }
        </button>
        
        <div class="mt-8 text-sm text-slate-400">
          <p>End-to-end encrypted. Your data is private.</p>
          <p class="mt-4">
            By continuing, you agree to our 
            <a routerLink="/terms" class="text-emerald-600 hover:underline">Terms of Service</a> and 
            <a routerLink="/privacy" class="text-emerald-600 hover:underline">Privacy Policy</a>.
          </p>
        </div>
      </div>
      <footer class="mt-8 text-center text-sm text-slate-400">
        Built by <a href="https://abuqitmir.tech" target="_blank" rel="noopener noreferrer" class="text-emerald-600 hover:text-emerald-700 font-medium transition-colors">Abuqitmir.tech</a>
      </footer>
    </div>
  `
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  
  isLoading = signal(false);
  error = signal<string | null>(null);

  async login() {
    if (this.isLoading()) return;
    
    this.isLoading.set(true);
    this.error.set(null);
    
    try {
      await this.authService.loginWithGoogle();
      this.router.navigate(['/dashboard']);
    } catch (err: unknown) {
      const errorObj = err as { code?: string; message?: string };
      const errorMessage = errorObj?.message || String(err);
      if (errorObj?.code === 'auth/cancelled-popup-request' || 
          errorObj?.code === 'auth/popup-closed-by-user' ||
          errorMessage.includes('popup-closed-by-user') ||
          errorMessage.includes('INTERNAL ASSERTION FAILED')) {
        this.error.set('Login popup was blocked or closed. If you are viewing this inside the AI Studio preview, please click the "Open in new tab" button (↗️) at the top right of the preview window and try again.');
      } else {
        this.error.set(errorMessage || 'Failed to login. Please try again.');
      }
      this.isLoading.set(false);
    }
  }
}


