import { Component, inject, computed, signal } from '@angular/core';
import { DataService } from '../data.service';
import { MatIconModule } from '@angular/material/icon';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MatIconModule, DatePipe, RouterLink, FormsModule],
  template: `
    <div class="p-4 md:p-8 max-w-5xl mx-auto">
      <header class="mb-8">
        <h1 class="text-2xl md:text-3xl font-semibold text-slate-900">Hello, {{ firstName() }}</h1>
        <p class="text-slate-500 mt-1">Here is your health summary for today.</p>
      </header>

      <!-- Quick Actions -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <button (click)="showMetricModal.set(true)" class="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 p-4 rounded-2xl flex flex-col items-center justify-center gap-2 transition-colors cursor-pointer">
          <mat-icon class="text-3xl w-8 h-8 flex items-center justify-center">add_circle</mat-icon>
          <span class="font-medium text-sm">Add Metric</span>
        </button>
        <button routerLink="/appointments" class="bg-blue-50 hover:bg-blue-100 text-blue-700 p-4 rounded-2xl flex flex-col items-center justify-center gap-2 transition-colors cursor-pointer">
          <mat-icon class="text-3xl w-8 h-8 flex items-center justify-center">calendar_month</mat-icon>
          <span class="font-medium text-sm">Book Doctor</span>
        </button>
        <button routerLink="/records" class="bg-purple-50 hover:bg-purple-100 text-purple-700 p-4 rounded-2xl flex flex-col items-center justify-center gap-2 transition-colors cursor-pointer">
          <mat-icon class="text-3xl w-8 h-8 flex items-center justify-center">upload_file</mat-icon>
          <span class="font-medium text-sm">Upload Report</span>
        </button>
        <button routerLink="/ai-assistant" class="bg-orange-50 hover:bg-orange-100 text-orange-700 p-4 rounded-2xl flex flex-col items-center justify-center gap-2 transition-colors cursor-pointer">
          <mat-icon class="text-3xl w-8 h-8 flex items-center justify-center">smart_toy</mat-icon>
          <span class="font-medium text-sm">Ask AI</span>
        </button>
      </div>

      @if (showMetricModal()) {
        <div class="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div class="bg-white rounded-3xl p-6 w-full max-w-md shadow-xl">
            <h2 class="text-xl font-semibold mb-4 text-slate-800">Add Health Metric</h2>
            <div class="space-y-4">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-1">Heart Rate (bpm)</label>
                  <input type="number" [(ngModel)]="newMetric.heartRate" class="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500">
                </div>
                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-1">Steps</label>
                  <input type="number" [(ngModel)]="newMetric.steps" class="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500">
                </div>
                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-1">Systolic BP</label>
                  <input type="number" [(ngModel)]="newMetric.systolicBP" class="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500">
                </div>
                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-1">Diastolic BP</label>
                  <input type="number" [(ngModel)]="newMetric.diastolicBP" class="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500">
                </div>
                <div class="col-span-2">
                  <label class="block text-sm font-medium text-slate-700 mb-1">Sleep (Hours)</label>
                  <input type="number" [(ngModel)]="newMetric.sleepHours" class="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500">
                </div>
              </div>
            </div>
            <div class="flex justify-end gap-3 mt-8">
              <button (click)="showMetricModal.set(false)" class="px-5 py-2.5 rounded-xl text-slate-600 font-medium hover:bg-slate-50 transition-colors cursor-pointer">Cancel</button>
              <button (click)="saveMetric()" class="px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition-colors cursor-pointer">Save Metric</button>
            </div>
          </div>
        </div>
      }

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <!-- Left Column: Health Metrics & Medications -->
        <div class="lg:col-span-2 space-y-6">
          
          <!-- Latest Metrics -->
          <section class="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-lg font-semibold text-slate-800">Latest Vitals</h2>
              <button class="text-emerald-600 text-sm font-medium">View History</button>
            </div>
            
            @if (latestMetric()) {
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div class="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div class="text-slate-500 text-xs font-medium uppercase tracking-wider mb-1">Heart Rate</div>
                  <div class="flex items-baseline gap-1">
                    <span class="text-2xl font-bold text-slate-800">{{ latestMetric().heartRate || '--' }}</span>
                    <span class="text-sm text-slate-500">bpm</span>
                  </div>
                </div>
                <div class="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div class="text-slate-500 text-xs font-medium uppercase tracking-wider mb-1">Blood Pressure</div>
                  <div class="flex items-baseline gap-1">
                    <span class="text-2xl font-bold text-slate-800">{{ latestMetric().systolicBP || '--' }}/{{ latestMetric().diastolicBP || '--' }}</span>
                  </div>
                </div>
                <div class="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div class="text-slate-500 text-xs font-medium uppercase tracking-wider mb-1">Steps</div>
                  <div class="flex items-baseline gap-1">
                    <span class="text-2xl font-bold text-slate-800">{{ latestMetric().steps || '--' }}</span>
                  </div>
                </div>
                <div class="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div class="text-slate-500 text-xs font-medium uppercase tracking-wider mb-1">Sleep</div>
                  <div class="flex items-baseline gap-1">
                    <span class="text-2xl font-bold text-slate-800">{{ latestMetric().sleepHours || '--' }}</span>
                    <span class="text-sm text-slate-500">hrs</span>
                  </div>
                </div>
              </div>
            } @else {
              <div class="text-center py-8 text-slate-500">
                <mat-icon class="text-4xl mb-2 opacity-50">monitor_heart</mat-icon>
                <p>No vitals recorded yet.</p>
              </div>
            }
          </section>

          <!-- Medications -->
          <section class="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-lg font-semibold text-slate-800">Today's Medications</h2>
              <button class="text-emerald-600 text-sm font-medium">Manage</button>
            </div>
            
            <div class="space-y-3">
              @for (med of activeMedications(); track med.id) {
                <div class="flex items-center justify-between p-4 rounded-2xl border border-slate-100 hover:border-emerald-100 transition-colors">
                  <div class="flex items-center gap-4">
                    <div class="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <mat-icon>medication</mat-icon>
                    </div>
                    <div>
                      <h3 class="font-medium text-slate-800">{{ med.name }}</h3>
                      <p class="text-sm text-slate-500">{{ med.dosage }} • {{ med.frequency }}</p>
                    </div>
                  </div>
                  <button class="w-8 h-8 rounded-full border-2 border-slate-200 hover:border-emerald-500 flex items-center justify-center text-transparent hover:text-emerald-500 transition-colors">
                    <mat-icon class="text-sm w-4 h-4 flex items-center justify-center">check</mat-icon>
                  </button>
                </div>
              } @empty {
                <div class="text-center py-6 text-slate-500">
                  <p>No active medications.</p>
                </div>
              }
            </div>
          </section>
        </div>

        <!-- Right Column: Appointments & Alerts -->
        <div class="space-y-6">
          
          <!-- Upcoming Appointments -->
          <section class="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <h2 class="text-lg font-semibold text-slate-800 mb-6">Upcoming Visits</h2>
            
            <div class="space-y-4">
              @for (appt of upcomingAppointments(); track appt.id) {
                <div class="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div class="flex items-start justify-between mb-3">
                    <div>
                      <h3 class="font-medium text-slate-800">{{ appt.doctorName }}</h3>
                      <p class="text-sm text-slate-500 capitalize">{{ appt.type.replace('_', ' ') }}</p>
                    </div>
                    <div class="bg-white px-2 py-1 rounded text-xs font-medium text-slate-600 border border-slate-200 shadow-sm">
                      {{ appt.date | date:'MMM d' }}
                    </div>
                  </div>
                  <div class="flex items-center gap-2 text-sm text-slate-600">
                    <mat-icon class="text-[16px] w-4 h-4">schedule</mat-icon>
                    {{ appt.date | date:'shortTime' }}
                  </div>
                </div>
              } @empty {
                <div class="text-center py-6 text-slate-500">
                  <p>No upcoming appointments.</p>
                </div>
              }
            </div>
          </section>

          <!-- Smart Alerts -->
          <section class="bg-orange-50 rounded-3xl p-6 border border-orange-100">
            <div class="flex items-center gap-2 mb-4 text-orange-800">
              <mat-icon>notifications_active</mat-icon>
              <h2 class="text-lg font-semibold">Smart Alerts</h2>
            </div>
            <ul class="space-y-3">
              <li class="flex items-start gap-3 text-orange-800 text-sm">
                <div class="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5 flex-shrink-0"></div>
                <p>Your blood pressure has been slightly elevated for the last 3 days. Consider checking it again today.</p>
              </li>
              <li class="flex items-start gap-3 text-orange-800 text-sm">
                <div class="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5 flex-shrink-0"></div>
                <p>Time to refill your Vitamin D prescription.</p>
              </li>
            </ul>
          </section>

        </div>
      </div>
    </div>
  `
})
export class DashboardComponent {
  dataService = inject(DataService);

  firstName = computed(() => {
    const name = this.dataService.userProfile()?.name || 'User';
    return name.split(' ')[0];
  });

  latestMetric = computed(() => {
    const metrics = this.dataService.metrics();
    return metrics.length > 0 ? metrics[0] : null;
  });

  activeMedications = computed(() => {
    return this.dataService.medications().filter(m => m.active);
  });

  upcomingAppointments = computed(() => {
    const now = new Date().toISOString();
    return this.dataService.appointments()
      .filter(a => a.date >= now && a.status === 'scheduled')
      .slice(0, 3);
  });

  showMetricModal = signal(false);
  newMetric = {
    heartRate: null as number | null,
    steps: null as number | null,
    systolicBP: null as number | null,
    diastolicBP: null as number | null,
    sleepHours: null as number | null
  };

  async saveMetric() {
    const userId = this.dataService.userProfile()?.uid;
    if (!userId) return;

    await this.dataService.addMetric({
      userId,
      date: new Date().toISOString(),
      heartRate: this.newMetric.heartRate,
      steps: this.newMetric.steps,
      systolicBP: this.newMetric.systolicBP,
      diastolicBP: this.newMetric.diastolicBP,
      sleepHours: this.newMetric.sleepHours
    });

    this.showMetricModal.set(false);
    this.newMetric = { heartRate: null, steps: null, systolicBP: null, diastolicBP: null, sleepHours: null };
  }
}
