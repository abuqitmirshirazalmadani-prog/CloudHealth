import { Injectable, inject, signal, effect } from '@angular/core';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { collection, doc, onSnapshot, setDoc, updateDoc, deleteDoc, query, where, orderBy, serverTimestamp, getDoc } from 'firebase/firestore';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private authService = inject(AuthService);

  userProfile = signal<any>(null);
  records = signal<any[]>([]);
  appointments = signal<any[]>([]);
  medications = signal<any[]>([]);
  metrics = signal<any[]>([]);

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

  async updateUserProfile(userId: string, data: any) {
    try {
      await updateDoc(doc(db, 'users', userId), data);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${userId}`);
    }
  }

  async addRecord(data: any) {
    try {
      const id = crypto.randomUUID();
      const now = new Date().toISOString();
      await setDoc(doc(db, 'records', id), { ...data, createdAt: now });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'records');
    }
  }

  async addAppointment(data: any) {
    try {
      const id = crypto.randomUUID();
      const now = new Date().toISOString();
      await setDoc(doc(db, 'appointments', id), { ...data, createdAt: now });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'appointments');
    }
  }

  async addMedication(data: any) {
    try {
      const id = crypto.randomUUID();
      const now = new Date().toISOString();
      await setDoc(doc(db, 'medications', id), { ...data, createdAt: now });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'medications');
    }
  }

  async updateMedication(id: string, data: any) {
    try {
      await updateDoc(doc(db, 'medications', id), data);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `medications/${id}`);
    }
  }

  async addMetric(data: any) {
    try {
      const id = crypto.randomUUID();
      const now = new Date().toISOString();
      await setDoc(doc(db, 'metrics', id), { ...data, createdAt: now });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'metrics');
    }
  }
}
