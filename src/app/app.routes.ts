import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login.component';
import { LayoutComponent } from './layout.component';
import { DashboardComponent } from './pages/dashboard.component';
import { RecordsComponent } from './pages/records.component';
import { AppointmentsComponent } from './pages/appointments.component';
import { MedicationsComponent } from './pages/medications.component';
import { AiAssistantComponent } from './pages/ai-assistant.component';
import { ProfileComponent } from './pages/profile.component';
import { PrivacyComponent } from './pages/privacy.component';
import { TermsComponent } from './pages/terms.component';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

const authGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  if (authService.isAuthReady() && !authService.currentUser()) {
    router.navigate(['/login']);
    return false;
  }
  return true;
};

const loginGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  if (authService.isAuthReady() && authService.currentUser()) {
    router.navigate(['/dashboard']);
    return false;
  }
  return true;
};

export const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [loginGuard] },
  { path: 'privacy', component: PrivacyComponent },
  { path: 'terms', component: TermsComponent },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'records', component: RecordsComponent },
      { path: 'appointments', component: AppointmentsComponent },
      { path: 'medications', component: MedicationsComponent },
      { path: 'ai-assistant', component: AiAssistantComponent },
      { path: 'profile', component: ProfileComponent }
    ]
  },
  { path: '**', redirectTo: 'dashboard' }
];
