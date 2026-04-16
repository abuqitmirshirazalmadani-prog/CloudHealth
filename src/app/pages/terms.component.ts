import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-terms',
  standalone: true,
  imports: [RouterLink, MatIconModule],
  template: `
    <div class="min-h-screen bg-slate-50 p-4 md:p-8">
      <div class="max-w-3xl mx-auto bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
        <header class="mb-8 flex items-center justify-between border-b border-slate-100 pb-6">
          <div>
            <h1 class="text-2xl font-bold text-slate-900">Terms of Service</h1>
            <p class="text-slate-500 mt-1">Last updated: April 2026</p>
          </div>
          <button routerLink="/login" class="text-slate-400 hover:text-slate-600 transition-colors">
            <mat-icon>close</mat-icon>
          </button>
        </header>

        <div class="prose prose-slate max-w-none text-slate-600">
          <h2 class="text-xl font-semibold text-slate-800 mt-6 mb-3">1. Acceptance of Terms</h2>
          <p>By accessing and using CloudHealth, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our application.</p>

          <h2 class="text-xl font-semibold text-slate-800 mt-6 mb-3">2. Description of Service</h2>
          <p>CloudHealth is a personal health companion application that allows users to store medical records, track vitals, manage appointments, and interact with an AI health assistant.</p>

          <h2 class="text-xl font-semibold text-slate-800 mt-6 mb-3">3. No Medical Advice</h2>
          <p><strong>CRITICAL DISCLAIMER:</strong> CloudHealth and its AI Assistant are NOT substitutes for professional medical advice, diagnosis, or treatment. Never disregard professional medical advice or delay in seeking it because of something you have read or received from our application. If you think you may have a medical emergency, call your doctor or emergency services immediately.</p>

          <h2 class="text-xl font-semibold text-slate-800 mt-6 mb-3">4. User Responsibilities</h2>
          <p>You are responsible for maintaining the confidentiality of your login credentials. You agree to provide accurate and complete health information to the best of your knowledge.</p>
          
          <h2 class="text-xl font-semibold text-slate-800 mt-6 mb-3">5. AI Generated Content</h2>
          <p>The AI Assistant generates responses based on patterns in data. It may produce inaccurate or inappropriate content. You should not rely on this content for medical decisions.</p>
        </div>
      </div>
    </div>
  `
})
export class TermsComponent {}
