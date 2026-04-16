import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from './auth.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, MatIconModule],
  template: `
    <div class="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      <!-- Mobile Header -->
      <header class="md:hidden bg-white border-b border-slate-200 p-4 flex items-center justify-between sticky top-0 z-20">
        <div class="flex items-center gap-2 text-emerald-600 font-semibold text-xl">
          <mat-icon>favorite</mat-icon>
          CloudHealth
        </div>
        <button (click)="authService.logout()" class="text-slate-500 hover:text-slate-800">
          <mat-icon>logout</mat-icon>
        </button>
      </header>

      <!-- Sidebar (Desktop) -->
      <aside class="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 sticky top-0 h-screen">
        <div class="p-6 flex items-center gap-2 text-emerald-600 font-semibold text-2xl border-b border-slate-100">
          <mat-icon>favorite</mat-icon>
          CloudHealth
        </div>
        
        <nav class="flex-1 p-4 space-y-1 overflow-y-auto">
          <a routerLink="/dashboard" routerLinkActive="bg-emerald-50 text-emerald-700" class="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors">
            <mat-icon>dashboard</mat-icon>
            <span class="font-medium">Dashboard</span>
          </a>
          <a routerLink="/records" routerLinkActive="bg-emerald-50 text-emerald-700" class="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors">
            <mat-icon>folder</mat-icon>
            <span class="font-medium">Records</span>
          </a>
          <a routerLink="/appointments" routerLinkActive="bg-emerald-50 text-emerald-700" class="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors">
            <mat-icon>calendar_today</mat-icon>
            <span class="font-medium">Appointments</span>
          </a>
          <a routerLink="/medications" routerLinkActive="bg-emerald-50 text-emerald-700" class="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors">
            <mat-icon>medication</mat-icon>
            <span class="font-medium">Medications</span>
          </a>
          <a routerLink="/ai-assistant" routerLinkActive="bg-emerald-50 text-emerald-700" class="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors">
            <mat-icon>smart_toy</mat-icon>
            <span class="font-medium">AI Assistant</span>
          </a>
          <a routerLink="/profile" routerLinkActive="bg-emerald-50 text-emerald-700" class="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors">
            <mat-icon>person</mat-icon>
            <span class="font-medium">Profile</span>
          </a>
        </nav>
        
        <div class="p-4 border-t border-slate-100">
          <button (click)="authService.logout()" class="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-slate-600 hover:bg-slate-50 transition-colors">
            <mat-icon>logout</mat-icon>
            <span class="font-medium">Log out</span>
          </button>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 pb-20 md:pb-0 overflow-x-hidden flex flex-col">
        <div class="flex-1">
          <router-outlet></router-outlet>
        </div>
        <footer class="mt-auto py-6 text-center text-sm text-slate-400 border-t border-slate-200">
          Built by <a href="https://abuqitmir.tech" target="_blank" rel="noopener noreferrer" class="text-emerald-600 hover:text-emerald-700 font-medium transition-colors">Abuqitmir.tech</a>
        </footer>
      </main>

      <!-- Bottom Nav (Mobile) -->
      <nav class="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around items-center p-2 z-20 pb-safe">
        <a routerLink="/dashboard" routerLinkActive="text-emerald-600" class="flex flex-col items-center p-2 text-slate-500">
          <mat-icon>dashboard</mat-icon>
          <span class="text-[10px] font-medium mt-1">Home</span>
        </a>
        <a routerLink="/records" routerLinkActive="text-emerald-600" class="flex flex-col items-center p-2 text-slate-500">
          <mat-icon>folder</mat-icon>
          <span class="text-[10px] font-medium mt-1">Records</span>
        </a>
        <a routerLink="/appointments" routerLinkActive="text-emerald-600" class="flex flex-col items-center p-2 text-slate-500">
          <mat-icon>calendar_today</mat-icon>
          <span class="text-[10px] font-medium mt-1">Visits</span>
        </a>
        <a routerLink="/ai-assistant" routerLinkActive="text-emerald-600" class="flex flex-col items-center p-2 text-slate-500">
          <mat-icon>smart_toy</mat-icon>
          <span class="text-[10px] font-medium mt-1">AI</span>
        </a>
        <a routerLink="/profile" routerLinkActive="text-emerald-600" class="flex flex-col items-center p-2 text-slate-500">
          <mat-icon>person</mat-icon>
          <span class="text-[10px] font-medium mt-1">Profile</span>
        </a>
      </nav>
    </div>
  `
})
export class LayoutComponent {
  authService = inject(AuthService);
}
