import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-privacy',
  standalone: true,
  imports: [RouterLink, MatIconModule],
  template: `
    <div class="min-h-screen bg-slate-50 p-4 md:p-8">
      <div class="max-w-3xl mx-auto bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
        <header class="mb-8 flex items-center justify-between border-b border-slate-100 pb-6">
          <div>
            <h1 class="text-2xl font-bold text-slate-900">Privacy Policy</h1>
            <p class="text-slate-500 mt-1">Last updated: April 2026</p>
          </div>
          <button routerLink="/login" class="text-slate-400 hover:text-slate-600 transition-colors">
            <mat-icon>close</mat-icon>
          </button>
        </header>

        <div class="prose prose-slate max-w-none text-slate-600">
          <h2 class="text-xl font-semibold text-slate-800 mt-6 mb-3">1. Information We Collect</h2>
          <p>When you use CloudHealth, we collect information you provide directly to us, including your name, email address, medical history, vital metrics, medications, appointments, and uploaded medical records/files.</p>

          <h2 class="text-xl font-semibold text-slate-800 mt-6 mb-3">2. How We Use Your Information</h2>
          <p>We use the information we collect to provide, maintain, and improve our services, including providing basic AI health guidance based on your prompts. Your uploaded files and health metrics are stored securely to allow you access from anywhere.</p>

          <h2 class="text-xl font-semibold text-slate-800 mt-6 mb-3">3. Data Security and Storage</h2>
          <p>Your data is stored securely using Google Firebase infrastructure. We implement security measures designed to protect your personal and medical information from unauthorized access, alteration, disclosure, or destruction.</p>

          <h2 class="text-xl font-semibold text-slate-800 mt-6 mb-3">4. Account Deletion and Data Rights</h2>
          <p>You have the right to access, update, or delete your information. You can delete specific records within the app, or you can request complete account deletion by contacting us. Upon account deletion, all associated health data, metrics, and files will be permanently erased.</p>
          
          <h2 class="text-xl font-semibold text-slate-800 mt-6 mb-3">5. Disclaimer regarding Medical Advice</h2>
          <p>The AI Assistant provided within CloudHealth is for informational purposes only and does not constitute medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.</p>
        </div>
      </div>
    </div>
  `
})
export class PrivacyComponent {}
