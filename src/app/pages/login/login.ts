import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FirebaseService } from '../../services/firebase';
import { BehaviorService } from '../../services/behavior';
import { FormsModule as For, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  email = '';
  loading = false;
  status = '';

  constructor(
    private firebaseService: FirebaseService,
    private router: Router,
    private behaviorService: BehaviorService
  ) { }

  async onLogin() {
    this.status = '';
    this.loading = true;

    this.behaviorService.startTracking();

    setTimeout(async () => {
      this.behaviorService.stopTracking();

      const storedProfile = await this.firebaseService.getUserProfileByEmail(this.email);

      if (!storedProfile) {
        this.status = '❌ No profile found. Please signup.';
        this.loading = false;
        return;
      }

      const liveProfile = this.behaviorService.getStatProfile();
      const score = this.behaviorService.compareProfiles(liveProfile, storedProfile);
      this.status = `Match Score: ${score.toFixed(2)}%`;

      if (score >= 60) {
        this.status = '✅ Login success!';
        this.router.navigate(['/dashboard']);
      } else {
        this.status = '⚠️ Behavior does not match. Try again.';
      }

      this.loading = false;
    }, 5000);
  }
}