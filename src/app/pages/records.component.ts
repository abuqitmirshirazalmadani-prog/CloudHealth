import { Component, inject, signal, computed } from '@angular/core';
import { DataService } from '../data.service';
import { MatIconModule } from '@angular/material/icon';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-records',
  standalone: true,
  imports: [MatIconModule, DatePipe, FormsModule],
  template: `
    <div class="p-4 md:p-8 max-w-5xl mx-auto">
      <header class="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl md:text-3xl font-semibold text-slate-900">Health Records</h1>
          <p class="text-slate-500 mt-1">Access your lab reports, prescriptions, and notes.</p>
        </div>
        <button (click)="showAddModal.set(true)" class="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 self-start md:self-auto cursor-pointer">
          <mat-icon>upload_file</mat-icon>
          Upload Record
        </button>
      </header>

      @if (showAddModal()) {
        <div class="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div class="bg-white rounded-3xl p-6 w-full max-w-md shadow-xl">
            <h2 class="text-xl font-semibold mb-4 text-slate-800">Upload Record</h2>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">Title</label>
                <input type="text" [(ngModel)]="newRecord.title" class="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="e.g. Annual Blood Test">
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">Record Type</label>
                <select [(ngModel)]="newRecord.type" class="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white">
                  <option value="lab_report">Lab Report</option>
                  <option value="prescription">Prescription</option>
                  <option value="doctor_note">Doctor Note</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">Date</label>
                <input type="date" [(ngModel)]="newRecord.date" class="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500">
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">Upload File (Max 5MB)</label>
                <input type="file" (change)="onFileSelected($event)" accept="image/*,.pdf" class="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white">
                @if (fileError()) {
                  <p class="text-red-500 text-xs mt-1">{{ fileError() }}</p>
                }
              </div>
            </div>
            <div class="flex justify-end gap-3 mt-8">
              <button (click)="showAddModal.set(false)" class="px-5 py-2.5 rounded-xl text-slate-600 font-medium hover:bg-slate-50 transition-colors cursor-pointer">Cancel</button>
              <button (click)="saveRecord()" [disabled]="!newRecord.title || !newRecord.date" class="px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50 cursor-pointer">Save</button>
            </div>
          </div>
        </div>
      }

      <!-- Filters -->
      <div class="flex gap-2 overflow-x-auto pb-4 mb-4 hide-scrollbar">
        <button (click)="activeFilter.set('all')" [class.bg-slate-900]="activeFilter() === 'all'" [class.text-white]="activeFilter() === 'all'" [class.bg-white]="activeFilter() !== 'all'" [class.text-slate-600]="activeFilter() !== 'all'" class="px-4 py-2 rounded-full border border-slate-200 text-sm font-medium whitespace-nowrap transition-colors cursor-pointer">All Records</button>
        <button (click)="activeFilter.set('lab_report')" [class.bg-slate-900]="activeFilter() === 'lab_report'" [class.text-white]="activeFilter() === 'lab_report'" [class.bg-white]="activeFilter() !== 'lab_report'" [class.text-slate-600]="activeFilter() !== 'lab_report'" class="px-4 py-2 rounded-full border border-slate-200 text-sm font-medium whitespace-nowrap transition-colors cursor-pointer">Lab Reports</button>
        <button (click)="activeFilter.set('prescription')" [class.bg-slate-900]="activeFilter() === 'prescription'" [class.text-white]="activeFilter() === 'prescription'" [class.bg-white]="activeFilter() !== 'prescription'" [class.text-slate-600]="activeFilter() !== 'prescription'" class="px-4 py-2 rounded-full border border-slate-200 text-sm font-medium whitespace-nowrap transition-colors cursor-pointer">Prescriptions</button>
        <button (click)="activeFilter.set('doctor_note')" [class.bg-slate-900]="activeFilter() === 'doctor_note'" [class.text-white]="activeFilter() === 'doctor_note'" [class.bg-white]="activeFilter() !== 'doctor_note'" [class.text-slate-600]="activeFilter() !== 'doctor_note'" class="px-4 py-2 rounded-full border border-slate-200 text-sm font-medium whitespace-nowrap transition-colors cursor-pointer">Doctor Notes</button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        @for (record of filteredRecords(); track record.id) {
          <div (click)="viewingRecord.set(record)" class="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow cursor-pointer group">
            <div class="flex items-start justify-between mb-4">
              <div class="w-12 h-12 rounded-2xl flex items-center justify-center"
                   [class.bg-blue-50]="record.type === 'lab_report'" [class.text-blue-600]="record.type === 'lab_report'"
                   [class.bg-purple-50]="record.type === 'prescription'" [class.text-purple-600]="record.type === 'prescription'"
                   [class.bg-orange-50]="record.type === 'doctor_note'" [class.text-orange-600]="record.type === 'doctor_note'">
                <mat-icon>
                  {{ record.type === 'lab_report' ? 'science' : record.type === 'prescription' ? 'medication' : 'description' }}
                </mat-icon>
              </div>
              <button class="text-slate-400 hover:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
                <mat-icon>more_vert</mat-icon>
              </button>
            </div>
            
            <h3 class="font-semibold text-slate-800 mb-1 line-clamp-1">{{ record.title }}</h3>
            <p class="text-sm text-slate-500 mb-4">{{ record.date | date:'mediumDate' }}</p>
            
            <div class="flex items-center justify-between pt-4 border-t border-slate-100">
              <span class="text-xs font-medium px-2 py-1 rounded bg-slate-50 text-slate-500 uppercase tracking-wider">
                {{ record.type.replace('_', ' ') }}
              </span>
              <button class="text-emerald-600 hover:bg-emerald-50 p-1.5 rounded-lg transition-colors">
                <mat-icon class="text-[20px] w-5 h-5 flex items-center justify-center">download</mat-icon>
              </button>
            </div>
          </div>
        } @empty {
          <div class="col-span-full text-center py-12 bg-white rounded-3xl border border-slate-100 border-dashed">
            <div class="w-16 h-16 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <mat-icon class="text-3xl">folder_open</mat-icon>
            </div>
            <h3 class="text-lg font-medium text-slate-800 mb-1">No records found</h3>
            <p class="text-slate-500 max-w-sm mx-auto">Upload your first lab report, prescription, or doctor note to keep them safe in the cloud.</p>
          </div>
        }
      </div>

      @if (viewingRecord()) {
        <div class="fixed inset-0 bg-slate-900/80 flex items-center justify-center z-50 p-4">
          <div class="bg-white rounded-3xl p-6 w-full max-w-3xl shadow-xl flex flex-col max-h-[90vh]">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-xl font-semibold text-slate-800">{{ viewingRecord().title }}</h2>
              <button (click)="viewingRecord.set(null)" class="text-slate-400 hover:text-slate-600 cursor-pointer">
                <mat-icon>close</mat-icon>
              </button>
            </div>
            <div class="flex-1 overflow-auto bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-center p-4">
              @if (viewingRecord().fileUrl) {
                @if (viewingRecord().fileUrl.startsWith('data:image')) {
                  <img [src]="viewingRecord().fileUrl" class="max-w-full max-h-full object-contain rounded-lg">
                } @else if (viewingRecord().fileUrl.startsWith('data:application/pdf')) {
                  <iframe [src]="getSafeUrl(viewingRecord().fileUrl)" class="w-full h-[60vh] rounded-lg"></iframe>
                } @else {
                  <p class="text-slate-500">Preview not available for this file type.</p>
                }
              } @else {
                <div class="text-center text-slate-400">
                  <mat-icon class="text-4xl mb-2">description</mat-icon>
                  <p>No file attached to this record.</p>
                </div>
              }
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class RecordsComponent {
  dataService = inject(DataService);
  sanitizer = inject(DomSanitizer);

  activeFilter = signal<string>('all');
  showAddModal = signal(false);
  
  selectedFile = signal<File | null>(null);
  fileDataUrl = signal<string | null>(null);
  fileError = signal<string | null>(null);
  viewingRecord = signal<any>(null);

  newRecord = {
    title: '',
    type: 'lab_report',
    date: new Date().toISOString().split('T')[0]
  };

  filteredRecords = computed(() => {
    const filter = this.activeFilter();
    const records = this.dataService.records();
    if (filter === 'all') return records;
    return records.filter(r => r.type === filter);
  });

  getSafeUrl(url: string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) {
      this.selectedFile.set(null);
      this.fileDataUrl.set(null);
      return;
    }

    // 500KB limit to safely fit inside Firestore's 1MB document limit
    if (file.size > 500 * 1024) {
      this.fileError.set('File is too large. Please select a file under 500KB.');
      this.selectedFile.set(null);
      this.fileDataUrl.set(null);
      return;
    }

    this.fileError.set(null);
    this.selectedFile.set(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      this.fileDataUrl.set(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  }

  async saveRecord() {
    const userId = this.dataService.userProfile()?.uid;
    if (!userId || !this.newRecord.title || !this.newRecord.date) return;

    let fileUrl = '';
    const file = this.selectedFile();
    if (file) {
      // Use the local base64 DataURL and inject directly into Firestore rather than an external storage bucket
      fileUrl = this.fileDataUrl() || '';
    }

    await this.dataService.addRecord({
      userId,
      title: this.newRecord.title,
      type: this.newRecord.type as any,
      date: new Date(this.newRecord.date).toISOString(),
      fileUrl: fileUrl
    });

    this.showAddModal.set(false);
    this.newRecord = { title: '', type: 'lab_report', date: new Date().toISOString().split('T')[0] };
    this.selectedFile.set(null);
    this.fileDataUrl.set(null);
    this.fileError.set(null);
  }
}
