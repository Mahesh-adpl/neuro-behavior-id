import { Component } from '@angular/core';
import { FirebaseService } from '../../services/firebase';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BehaviorService } from '../../services/behavior';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-signup',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './signup.html',
  styleUrl: './signup.scss'
})
export class Signup {

  email = '';
  loading = false;
  status = '';

  constructor(private firebaseService: FirebaseService,
    private behaviorService: BehaviorService,
  ) { }

  async onSignup() {
  this.status = '';
  this.loading = true;

  this.behaviorService.startTracking();

  setTimeout(async () => {
    this.behaviorService.stopTracking();
    await this.firebaseService.saveNewUser(this.email);
    this.status = '✅ Profile saved successfully.';
    this.loading = false;
  }, 5000);
}

}

