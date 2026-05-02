import { Injectable, inject, signal, effect } from '@angular/core';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { collection, doc, onSnapshot, setDoc, updateDoc, query, where, orderBy } from 'firebase/firestore';
import { AuthService } from './auth.service';

export interface EmergencyContact {
  name?: string;
  relation?: string;
  phone?: string;
}

export interface UserProfile {
  id: string; // id is usually always present when requested
  uid?: string;
  name?: string;
  email?: string;
  role?: string;
  height?: string;
  weight?: string;
  bloodType?: string;
  medicalHistory?: string[];
  allergies?: string[];
  emergencyContacts?: EmergencyContact[];
}

export interface HealthRecord {
  id: string;
  userId?: string;
  title?: string;
  type?: string;
  date?: string;
  fileUrl?: string;
}

export interface Appointment {
  id: string;
  userId?: string;
  doctorName?: string;
  date?: string;
  type?: string;
  status?: string;
}

export interface Medication {
  id: string;
  userId?: string;
  name?: string;
  dosage?: string;
  frequency?: string;
  active?: boolean;
  timeOfDay?: string[];
}

export interface Metric {
  id: string;
  userId?: string;
  date?: string;
  heartRate?: number | null;
  steps?: number | null;
  systolicBP?: number | null;
  diastolicBP?: number | null;
  sleepHours?: number | null;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private authService = inject(AuthService);

  userProfile = signal<UserProfile | null>(null);
  records = signal<HealthRecord[]>([]);
  appointments = signal<Appointment[]>([]);
  medications = signal<Medication[]>([]);
  metrics = signal<Metric[]>([]);

  private unsubscribes: (() => void)[] = [];

  constructor() {
    effect(() => {
      const user = this.authService.currentUser();
      const isReady = this.authService.isAuthReady();
      
      this.cleanup();
      
      if (isReady && user) {
        this.setupListeners(user.uid);
      } else {
        this.userProfile.set(null);
        this.records.set([]);
        this.appointments.set([]);
        this.medications.set([]);
        this.metrics.set([]);
      }
    });
  }

  private setupListeners(userId: string) {
    // User Profile
    const userRef = doc(db, 'users', userId);
    this.unsubscribes.push(
      onSnapshot(userRef, (docSnap) => {
        if (docSnap.exists()) {
          this.userProfile.set({ id: docSnap.id, ...docSnap.data() });
        } else {
          // Create default profile
          this.createUserProfile(userId, this.authService.currentUser()?.displayName || 'User', this.authService.currentUser()?.email || '');
        }
      }, (error) => handleFirestoreError(error, OperationType.GET, `users/${userId}`))
    );

    // Records
    const recordsQuery = query(collection(db, 'records'), where('userId', '==', userId), orderBy('createdAt', 'desc'));
    this.unsubscribes.push(
      onSnapshot(recordsQuery, (snapshot) => {
        this.records.set(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
      }, (error) => handleFirestoreError(error, OperationType.LIST, 'records'))
    );

    // Appointments
    const apptsQuery = query(collection(db, 'appointments'), where('patientId', '==', userId), orderBy('date', 'asc'));
    this.unsubscribes.push(
      onSnapshot(apptsQuery, (snapshot) => {
        this.appointments.set(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
      }, (error) => handleFirestoreError(error, OperationType.LIST, 'appointments'))
    );

    // Medications
    const medsQuery = query(collection(db, 'medications'), where('userId', '==', userId));
    this.unsubscribes.push(
      onSnapshot(medsQuery, (snapshot) => {
        this.medications.set(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
      }, (error) => handleFirestoreError(error, OperationType.LIST, 'medications'))
    );

    // Metrics
    const metricsQuery = query(collection(db, 'metrics'), where('userId', '==', userId), orderBy('date', 'desc'));
    this.unsubscribes.push(
      onSnapshot(metricsQuery, (snapshot) => {
        this.metrics.set(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
      }, (error) => handleFirestoreError(error, OperationType.LIST, 'metrics'))
    );
  }

  private cleanup() {
    this.unsubscribes.forEach(unsub => unsub());
    this.unsubscribes = [];
  }

  async createUserProfile(userId: string, name: string, email: string) {
    try {
      const now = new Date().toISOString();
      await setDoc(doc(db, 'users', userId), {
        uid: userId,
        name,
        email,
        role: 'patient',
        createdAt: now,
        medicalHistory: [],
        allergies: [],
        emergencyContacts: []
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `users/${userId}`);
    }
  }

  async updateUserProfile(userId: string, data: Record<string, unknown>) {
    try {
      await updateDoc(doc(db, 'users', userId), data);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${userId}`);
    }
  }

  async addRecord(data: Record<string, unknown>) {
    try {
      const id = crypto.randomUUID();
      const now = new Date().toISOString();
      await setDoc(doc(db, 'records', id), { ...data, createdAt: now });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'records');
    }
  }

  async addAppointment(data: Record<string, unknown>) {
    try {
      const id = crypto.randomUUID();
      const now = new Date().toISOString();
      await setDoc(doc(db, 'appointments', id), { ...data, createdAt: now });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'appointments');
    }
  }

  async addMedication(data: Record<string, unknown>) {
    try {
      const id = crypto.randomUUID();
      const now = new Date().toISOString();
      await setDoc(doc(db, 'medications', id), { ...data, createdAt: now });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'medications');
    }
  }

  async updateMedication(id: string, data: Record<string, unknown>) {
    try {
      await updateDoc(doc(db, 'medications', id), data);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `medications/${id}`);
    }
  }

  async addMetric(data: Record<string, unknown>) {
    try {
      const id = crypto.randomUUID();
      const now = new Date().toISOString();
      await setDoc(doc(db, 'metrics', id), { ...data, createdAt: now });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'metrics');
    }
  }
}
