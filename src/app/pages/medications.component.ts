import { Component, inject, signal } from '@angular/core';
import { DataService } from '../data.service';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-medications',
  standalone: true,
  imports: [MatIconModule, FormsModule],
  template: `
    <div class="p-4 md:p-8 max-w-5xl mx-auto">
      <header class="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl md:text-3xl font-semibold text-slate-900">Medications</h1>
          <p class="text-slate-500 mt-1">Track your daily medications and reminders.</p>
        </div>
        <button (click)="showAddModal.set(true)" class="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 self-start md:self-auto cursor-pointer">
          <mat-icon>add</mat-icon>
          Add Medication
        </button>
      </header>

      @if (showAddModal()) {
        <div class="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div class="bg-white rounded-3xl p-6 w-full max-w-md shadow-xl">
            <h2 class="text-xl font-semibold mb-4 text-slate-800">Add Medication</h2>
            <div class="space-y-4">
              <div>
                <label for="medNameInput" class="block text-sm font-medium text-slate-700 mb-1">Medication Name</label>
                <input id="medNameInput" type="text" [(ngModel)]="newMed.name" class="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="e.g. Lisinopril">
              </div>
              <div>
                <label for="medDosageInput" class="block text-sm font-medium text-slate-700 mb-1">Dosage</label>
                <input id="medDosageInput" type="text" [(ngModel)]="newMed.dosage" class="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="e.g. 10mg">
              </div>
              <div>
                <label for="medFreqInput" class="block text-sm font-medium text-slate-700 mb-1">Frequency</label>
                <input id="medFreqInput" type="text" [(ngModel)]="newMed.frequency" class="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="e.g. Once daily">
              </div>
            </div>
            <div class="flex justify-end gap-3 mt-8">
              <button (click)="showAddModal.set(false)" class="px-5 py-2.5 rounded-xl text-slate-600 font-medium hover:bg-slate-50 transition-colors cursor-pointer">Cancel</button>
              <button (click)="saveMedication()" [disabled]="!newMed.name || !newMed.dosage" class="px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50 cursor-pointer">Save</button>
            </div>
          </div>
        </div>
      }

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        @for (med of dataService.medications(); track med.id) {
          <div class="bg-white rounded-3xl p-5 shadow-sm border border-slate-100" [class.opacity-60]="!med.active">
            <div class="flex items-start justify-between mb-4">
              <div class="w-12 h-12 rounded-2xl flex items-center justify-center"
                   [class.bg-emerald-50]="med.active" [class.text-emerald-600]="med.active"
                   [class.bg-slate-50]="!med.active" [class.text-slate-400]="!med.active">
                <mat-icon>medication</mat-icon>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                      [class.bg-emerald-100]="med.active" [class.text-emerald-700]="med.active"
                      [class.bg-slate-100]="!med.active" [class.text-slate-600]="!med.active">
                  {{ med.active ? 'Active' : 'Inactive' }}
                </span>
                <button class="text-slate-400 hover:text-slate-600 transition-colors">
                  <mat-icon>more_vert</mat-icon>
                </button>
              </div>
            </div>
            
            <h3 class="font-semibold text-slate-800 mb-1">{{ med.name }}</h3>
            <p class="text-sm text-slate-500 mb-4">{{ med.dosage }} • {{ med.frequency }}</p>
            
            <div class="flex flex-wrap gap-2 pt-4 border-t border-slate-100">
              @for (time of med.timeOfDay; track time) {
                <span class="text-xs font-medium px-2 py-1 rounded bg-slate-50 text-slate-600 border border-slate-200">
                  {{ time }}
                </span>
              }
            </div>
          </div>
        } @empty {
          <div class="col-span-full text-center py-12 bg-white rounded-3xl border border-slate-100 border-dashed">
            <div class="w-16 h-16 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <mat-icon class="text-3xl">medication</mat-icon>
            </div>
            <h3 class="text-lg font-medium text-slate-800 mb-1">No medications</h3>
            <p class="text-slate-500 max-w-sm mx-auto">Add your medications to get smart reminders and track your adherence.</p>
          </div>
        }
      </div>
    </div>
  `
})
export class MedicationsComponent {
  dataService = inject(DataService);

  showAddModal = signal(false);
  newMed = {
    name: '',
    dosage: '',
    frequency: ''
  };

  async saveMedication() {
    const userId = this.dataService.userProfile()?.uid;
    if (!userId || !this.newMed.name) return;

    await this.dataService.addMedication({
      userId,
      name: this.newMed.name,
      dosage: this.newMed.dosage,
      frequency: this.newMed.frequency,
      active: true,
      timeOfDay: ['Morning']
    });

    this.showAddModal.set(false);
    this.newMed = { name: '', dosage: '', frequency: '' };
  }
}
