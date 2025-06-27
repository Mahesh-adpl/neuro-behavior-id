import { Injectable } from '@angular/core';
import { Firestore, addDoc, doc, getDoc, setDoc } from '@angular/fire/firestore';
import { BehaviorService } from './behavior';
import { collection, getDocs, query, where } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(private firestore: Firestore, private behaviorService: BehaviorService) {}

  async saveNewUser(email: string) {
    const profile = this.behaviorService.getStatProfile();
    await addDoc(collection(this.firestore, 'users'), {
      email,
      profile
    });
  }

  async getUserProfileByEmail(email: string): Promise<any> {
    const q = query(collection(this.firestore, 'users'), where('email', '==', email));
    const snap = await getDocs(q);
    if (snap.empty) return null;
    return snap.docs[0].data()['profile'];
  }
}