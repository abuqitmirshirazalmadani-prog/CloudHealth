import { Component, inject, signal } from '@angular/core';
import { DataService } from '../data.service';
import { AuthService } from '../auth.service';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [MatIconModule, FormsModule],
  template: `
    <div class="p-4 md:p-8 max-w-4xl mx-auto">
      <header class="mb-8 flex items-center justify-between">
        <div>
          <h1 class="text-2xl md:text-3xl font-semibold text-slate-900">Profile</h1>
          <p class="text-slate-500 mt-1">Manage your personal and medical information.</p>
        </div>
        <button class="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors">
          Edit Profile
        </button>
      </header>

      @if (dataService.userProfile()) {
        <div class="space-y-6">
          <!-- Personal Info -->
          <section class="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <div class="flex items-center gap-6 mb-6">
              <div class="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-3xl font-semibold">
                {{ dataService.userProfile().name.charAt(0) }}
              </div>
              <div>
                <h2 class="text-xl font-semibold text-slate-800">{{ dataService.userProfile().name }}</h2>
                <p class="text-slate-500">{{ dataService.userProfile().email }}</p>
                <div class="mt-2 inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-medium uppercase tracking-wider">
                  {{ dataService.userProfile().role }}
                </div>
              </div>
            </div>
          </section>

          <!-- Medical History -->
          <section class="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold text-slate-800 flex items-center gap-2">
                <mat-icon class="text-emerald-600">history</mat-icon>
                Medical History
              </h3>
              <button (click)="showMedicalHistoryModal.set(true)" class="text-emerald-600 hover:bg-emerald-50 p-2 rounded-full transition-colors cursor-pointer">
                <mat-icon>add</mat-icon>
              </button>
            </div>
            
            <div class="flex flex-wrap gap-2">
              @for (item of dataService.userProfile().medicalHistory; track item) {
                <div class="bg-slate-50 border border-slate-200 text-slate-700 px-3 py-1.5 rounded-lg text-sm flex items-center gap-2">
                  {{ item }}
                  <button (click)="removeMedicalHistory(item)" class="text-slate-400 hover:text-red-500 cursor-pointer"><mat-icon class="text-[16px] w-4 h-4">close</mat-icon></button>
                </div>
              } @empty {
                <p class="text-slate-500 text-sm">No medical history recorded.</p>
              }
            </div>
          </section>

          <!-- Allergies -->
          <section class="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold text-slate-800 flex items-center gap-2">
                <mat-icon class="text-orange-500">warning</mat-icon>
                Allergies
              </h3>
              <button (click)="showAllergyModal.set(true)" class="text-emerald-600 hover:bg-emerald-50 p-2 rounded-full transition-colors cursor-pointer">
                <mat-icon>add</mat-icon>
              </button>
            </div>
            
            <div class="flex flex-wrap gap-2">
              @for (item of dataService.userProfile().allergies; track item) {
                <div class="bg-orange-50 border border-orange-100 text-orange-800 px-3 py-1.5 rounded-lg text-sm flex items-center gap-2">
                  {{ item }}
                  <button (click)="removeAllergy(item)" class="text-orange-400 hover:text-red-500 cursor-pointer"><mat-icon class="text-[16px] w-4 h-4">close</mat-icon></button>
                </div>
              } @empty {
                <p class="text-slate-500 text-sm">No known allergies.</p>
              }
            </div>
          </section>

          <!-- Emergency Contacts -->
          <section class="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold text-slate-800 flex items-center gap-2">
                <mat-icon class="text-red-500">contact_phone</mat-icon>
                Emergency Contacts
              </h3>
              <button (click)="showEmergencyContactModal.set(true)" class="text-emerald-600 hover:bg-emerald-50 p-2 rounded-full transition-colors cursor-pointer">
                <mat-icon>add</mat-icon>
              </button>
            </div>
            
            <div class="space-y-3">
              @for (contact of dataService.userProfile().emergencyContacts; track contact.phone) {
                <div class="flex items-center justify-between p-4 rounded-2xl border border-slate-100">
                  <div>
                    <h4 class="font-medium text-slate-800">{{ contact.name }}</h4>
                    <p class="text-sm text-slate-500">{{ contact.relation }} • {{ contact.phone }}</p>
                  </div>
                  <button (click)="removeEmergencyContact(contact)" class="text-slate-400 hover:text-red-500 p-2 rounded-full transition-colors cursor-pointer">
                    <mat-icon>delete</mat-icon>
                  </button>
                </div>
              } @empty {
                <p class="text-slate-500 text-sm">No emergency contacts added.</p>
              }
            </div>
          </section>
        </div>

        <!-- Modals -->
        @if (showMedicalHistoryModal()) {
          <div class="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
            <div class="bg-white rounded-3xl p-6 w-full max-w-md shadow-xl">
              <h2 class="text-xl font-semibold mb-4 text-slate-800">Add Medical History</h2>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-1">Condition / Surgery</label>
                  <input type="text" [(ngModel)]="newMedicalHistory" class="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="e.g. Appendectomy (2015)">
                </div>
              </div>
              <div class="flex justify-end gap-3 mt-8">
                <button (click)="showMedicalHistoryModal.set(false)" class="px-5 py-2.5 rounded-xl text-slate-600 font-medium hover:bg-slate-50 transition-colors cursor-pointer">Cancel</button>
                <button (click)="saveMedicalHistory()" [disabled]="!newMedicalHistory" class="px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50 cursor-pointer">Save</button>
              </div>
            </div>
          </div>
        }

        @if (showAllergyModal()) {
          <div class="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
            <div class="bg-white rounded-3xl p-6 w-full max-w-md shadow-xl">
              <h2 class="text-xl font-semibold mb-4 text-slate-800">Add Allergy</h2>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-1">Allergy</label>
                  <input type="text" [(ngModel)]="newAllergy" class="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="e.g. Penicillin">
                </div>
              </div>
              <div class="flex justify-end gap-3 mt-8">
                <button (click)="showAllergyModal.set(false)" class="px-5 py-2.5 rounded-xl text-slate-600 font-medium hover:bg-slate-50 transition-colors cursor-pointer">Cancel</button>
                <button (click)="saveAllergy()" [disabled]="!newAllergy" class="px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50 cursor-pointer">Save</button>
              </div>
            </div>
          </div>
        }

        @if (showEmergencyContactModal()) {
          <div class="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
            <div class="bg-white rounded-3xl p-6 w-full max-w-md shadow-xl">
              <h2 class="text-xl font-semibold mb-4 text-slate-800">Add Emergency Contact</h2>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-1">Name</label>
                  <input type="text" [(ngModel)]="newEmergencyContact.name" class="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="e.g. Jane Doe">
                </div>
                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-1">Relation</label>
                  <input type="text" [(ngModel)]="newEmergencyContact.relation" class="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="e.g. Spouse">
                </div>
                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                  <input type="tel" [(ngModel)]="newEmergencyContact.phone" class="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="e.g. +1 555-0123">
                </div>
              </div>
              <div class="flex justify-end gap-3 mt-8">
                <button (click)="showEmergencyContactModal.set(false)" class="px-5 py-2.5 rounded-xl text-slate-600 font-medium hover:bg-slate-50 transition-colors cursor-pointer">Cancel</button>
                <button (click)="saveEmergencyContact()" [disabled]="!newEmergencyContact.name || !newEmergencyContact.phone" class="px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50 cursor-pointer">Save</button>
              </div>
            </div>
          </div>
        }

        <!-- Danger Zone -->
        <section class="mt-12 pt-8 border-t border-red-100">
          <h3 class="text-lg font-semibold text-red-600 flex items-center gap-2 mb-4">
            <mat-icon>warning</mat-icon>
            Danger Zone
          </h3>
          <p class="text-sm text-slate-500 mb-4">Once you delete your account, there is no going back. All of your health records, metrics, and data will be permanently erased.</p>
          <button (click)="confirmDeleteAccount()" class="border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 px-5 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer flex items-center gap-2">
            Delete Account
          </button>
        </section>

        @if (showDeleteConfirmModal()) {
          <div class="fixed inset-0 bg-slate-900/70 flex items-center justify-center z-50 p-4">
            <div class="bg-white rounded-3xl p-6 w-full max-w-md shadow-xl border-t-4 border-t-red-500 text-center">
              <div class="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <mat-icon class="text-3xl">warning</mat-icon>
              </div>
              <h2 class="text-xl font-bold mb-2 text-slate-800">Delete Account?</h2>
              <p class="text-slate-500 mb-6 text-sm">This action cannot be undone. All your personal data, medical history, files, and records will be permanently removed from our servers.</p>
              
              <div class="flex flex-col sm:flex-row justify-center gap-3">
                <button (click)="showDeleteConfirmModal.set(false)" class="px-5 py-2.5 rounded-xl text-slate-600 font-medium hover:bg-slate-100 transition-colors cursor-pointer w-full sm:w-auto">Keep Account</button>
                <button (click)="deleteAccount()" class="px-5 py-2.5 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 transition-colors cursor-pointer w-full sm:w-auto flex items-center justify-center gap-2">
                  <mat-icon class="text-[18px]">delete_forever</mat-icon>
                  Yes, Delete Account
                </button>
              </div>
            </div>
          </div>
        }
      }
    </div>
  `
})
export class ProfileComponent {
  dataService = inject(DataService);
  authService = inject(AuthService);

  showMedicalHistoryModal = signal(false);
  showAllergyModal = signal(false);
  showEmergencyContactModal = signal(false);
  showDeleteConfirmModal = signal(false);

  newMedicalHistory = '';
  newAllergy = '';
  newEmergencyContact = { name: '', relation: '', phone: '' };

  confirmDeleteAccount() {
    this.showDeleteConfirmModal.set(true);
  }

  async deleteAccount() {
    try {
      const user = this.authService.currentUser();
      if (user) {
        await user.delete();
        // The auth state observer in AuthService will catch this and route to login
      }
    } catch (error) {
      console.error('Failed to delete user:', error);
      alert('Could not delete account. You may need to log out and log back in to verify your identity before deleting.');
    }
  }

  async saveMedicalHistory() {
    const profile = this.dataService.userProfile();
    if (!profile || !this.newMedicalHistory) return;

    const updatedHistory = [...(profile.medicalHistory || []), this.newMedicalHistory];
    await this.dataService.updateUserProfile(profile.id, { medicalHistory: updatedHistory });
    
    this.newMedicalHistory = '';
    this.showMedicalHistoryModal.set(false);
  }

  async removeMedicalHistory(item: string) {
    const profile = this.dataService.userProfile();
    if (!profile) return;

    const updatedHistory = (profile.medicalHistory || []).filter((i: string) => i !== item);
    await this.dataService.updateUserProfile(profile.id, { medicalHistory: updatedHistory });
  }

  async saveAllergy() {
    const profile = this.dataService.userProfile();
    if (!profile || !this.newAllergy) return;

    const updatedAllergies = [...(profile.allergies || []), this.newAllergy];
    await this.dataService.updateUserProfile(profile.id, { allergies: updatedAllergies });
    
    this.newAllergy = '';
    this.showAllergyModal.set(false);
  }

  async removeAllergy(item: string) {
    const profile = this.dataService.userProfile();
    if (!profile) return;

    const updatedAllergies = (profile.allergies || []).filter((i: string) => i !== item);
    await this.dataService.updateUserProfile(profile.id, { allergies: updatedAllergies });
  }

  async saveEmergencyContact() {
    const profile = this.dataService.userProfile();
    if (!profile || !this.newEmergencyContact.name || !this.newEmergencyContact.phone) return;

    const updatedContacts = [...(profile.emergencyContacts || []), { ...this.newEmergencyContact }];
    await this.dataService.updateUserProfile(profile.id, { emergencyContacts: updatedContacts });
    
    this.newEmergencyContact = { name: '', relation: '', phone: '' };
    this.showEmergencyContactModal.set(false);
  }

  async removeEmergencyContact(contact: any) {
    const profile = this.dataService.userProfile();
    if (!profile) return;

    const updatedContacts = (profile.emergencyContacts || []).filter((c: any) => c.phone !== contact.phone || c.name !== contact.name);
    await this.dataService.updateUserProfile(profile.id, { emergencyContacts: updatedContacts });
  }
}
