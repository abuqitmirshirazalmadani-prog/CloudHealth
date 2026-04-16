import { Component, inject, signal } from '@angular/core';
import { DataService } from '../data.service';
import { MatIconModule } from '@angular/material/icon';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [MatIconModule, DatePipe, FormsModule],
  template: `
    <div class="p-4 md:p-8 max-w-5xl mx-auto">
      <header class="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl md:text-3xl font-semibold text-slate-900">Appointments</h1>
          <p class="text-slate-500 mt-1">Manage your upcoming and past doctor visits.</p>
        </div>
        <button (click)="showAddModal.set(true)" class="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 self-start md:self-auto cursor-pointer">
          <mat-icon>add</mat-icon>
          Book Appointment
        </button>
      </header>

      @if (showAddModal()) {
        <div class="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div class="bg-white rounded-3xl p-6 w-full max-w-md shadow-xl">
            <h2 class="text-xl font-semibold mb-4 text-slate-800">Book Appointment</h2>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">Doctor Name</label>
                <input type="text" [(ngModel)]="newAppt.doctorName" class="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="e.g. Dr. Smith">
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">Date & Time</label>
                <input type="datetime-local" [(ngModel)]="newAppt.date" class="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500">
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">Visit Type</label>
                <select [(ngModel)]="newAppt.type" class="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white">
                  <option value="in_person">In-Person Visit</option>
                  <option value="video">Video Consultation</option>
                </select>
              </div>
            </div>
            <div class="flex justify-end gap-3 mt-8">
              <button (click)="showAddModal.set(false)" class="px-5 py-2.5 rounded-xl text-slate-600 font-medium hover:bg-slate-50 transition-colors cursor-pointer">Cancel</button>
              <button (click)="saveAppointment()" [disabled]="!newAppt.doctorName || !newAppt.date" class="px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50 cursor-pointer">Book</button>
            </div>
          </div>
        </div>
      }

      <div class="space-y-4">
        @for (appt of dataService.appointments(); track appt.id) {
          <div class="bg-white rounded-3xl p-5 md:p-6 shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div class="flex items-start gap-4">
              <div class="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                   [class.bg-emerald-50]="appt.status === 'scheduled'" [class.text-emerald-600]="appt.status === 'scheduled'"
                   [class.bg-slate-50]="appt.status === 'completed'" [class.text-slate-400]="appt.status === 'completed'"
                   [class.bg-red-50]="appt.status === 'cancelled'" [class.text-red-500]="appt.status === 'cancelled'">
                <mat-icon>
                  {{ appt.type === 'video' ? 'videocam' : 'person' }}
                </mat-icon>
              </div>
              <div>
                <div class="flex items-center gap-2 mb-1">
                  <h3 class="font-semibold text-slate-800 text-lg">{{ appt.doctorName }}</h3>
                  <span class="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                        [class.bg-emerald-100]="appt.status === 'scheduled'" [class.text-emerald-700]="appt.status === 'scheduled'"
                        [class.bg-slate-100]="appt.status === 'completed'" [class.text-slate-600]="appt.status === 'completed'"
                        [class.bg-red-100]="appt.status === 'cancelled'" [class.text-red-700]="appt.status === 'cancelled'">
                    {{ appt.status }}
                  </span>
                </div>
                <p class="text-slate-500 text-sm mb-2">{{ appt.type === 'video' ? 'Video Consultation' : 'In-Person Visit' }}</p>
                <div class="flex items-center gap-4 text-sm font-medium text-slate-700">
                  <div class="flex items-center gap-1.5">
                    <mat-icon class="text-[16px] w-4 h-4 text-slate-400">calendar_today</mat-icon>
                    {{ appt.date | date:'mediumDate' }}
                  </div>
                  <div class="flex items-center gap-1.5">
                    <mat-icon class="text-[16px] w-4 h-4 text-slate-400">schedule</mat-icon>
                    {{ appt.date | date:'shortTime' }}
                  </div>
                </div>
              </div>
            </div>
            
            <div class="flex items-center gap-2 md:self-end">
              @if (appt.status === 'scheduled') {
                <button class="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-medium transition-colors">
                  Reschedule
                </button>
                @if (appt.type === 'video') {
                  <button class="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium transition-colors flex items-center gap-2">
                    <mat-icon class="text-[18px] w-[18px] h-[18px]">videocam</mat-icon>
                    Join
                  </button>
                }
              } @else {
                <button class="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-medium transition-colors">
                  View Details
                </button>
              }
            </div>
          </div>
        } @empty {
          <div class="text-center py-12 bg-white rounded-3xl border border-slate-100 border-dashed">
            <div class="w-16 h-16 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <mat-icon class="text-3xl">event_available</mat-icon>
            </div>
            <h3 class="text-lg font-medium text-slate-800 mb-1">No appointments</h3>
            <p class="text-slate-500 max-w-sm mx-auto">You don't have any upcoming or past appointments.</p>
          </div>
        }
      </div>
    </div>
  `
})
export class AppointmentsComponent {
  dataService = inject(DataService);

  showAddModal = signal(false);
  newAppt = {
    doctorName: '',
    date: '',
    type: 'in_person'
  };

  async saveAppointment() {
    const userId = this.dataService.userProfile()?.uid;
    if (!userId || !this.newAppt.doctorName || !this.newAppt.date) return;

    await this.dataService.addAppointment({
      patientId: userId,
      doctorId: 'unassigned', // In a real app, this would be selected from a list
      doctorName: this.newAppt.doctorName,
      date: new Date(this.newAppt.date).toISOString(),
      status: 'scheduled',
      type: this.newAppt.type
    });

    this.showAddModal.set(false);
    this.newAppt = { doctorName: '', date: '', type: 'in_person' };
  }
}
