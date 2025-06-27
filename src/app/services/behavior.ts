import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BehaviorService {

   private mousePoints: { x: number, y: number, t: number }[] = [];
  private typingTimes: number[] = [];
  private lastKeyTime: number = 0;
  private startTime: number = 0;

  private mouseListener: any;
  private keyListener: any;

  constructor() {}

  startTracking() {
    this.mousePoints = [];
    this.typingTimes = [];
    this.lastKeyTime = 0;
    this.startTime = Date.now();

    this.mouseListener = (e: MouseEvent) => {
      this.mousePoints.push({
        x: e.clientX,
        y: e.clientY,
        t: Date.now()
      });
    };

    this.keyListener = (e: KeyboardEvent) => {
      const now = Date.now();
      if (this.lastKeyTime !== 0) {
        this.typingTimes.push(now - this.lastKeyTime);
      }
      this.lastKeyTime = now;
    };

    document.addEventListener('mousemove', this.mouseListener);
    document.addEventListener('keydown', this.keyListener);
  }

  stopTracking() {
    document.removeEventListener('mousemove', this.mouseListener);
    document.removeEventListener('keydown', this.keyListener);
  }

  getStatProfile() {
    // Mouse distance
    let totalDistance = 0;
    for (let i = 1; i < this.mousePoints.length; i++) {
      const dx = this.mousePoints[i].x - this.mousePoints[i - 1].x;
      const dy = this.mousePoints[i].y - this.mousePoints[i - 1].y;
      totalDistance += Math.sqrt(dx * dx + dy * dy);
    }

    // Mouse duration
    const duration = (Date.now() - this.startTime) / 1000; // sec
    const avgSpeed = duration > 0 ? totalDistance / duration : 0;

    // Typing average interval
    const avgInterval =
      this.typingTimes.length > 0
        ? this.typingTimes.reduce((a, b) => a + b, 0) / this.typingTimes.length
        : 0;

    return {
      mouse: {
        avgSpeed,
        totalDistance
      },
      typing: {
        avgInterval,
        totalKeys: this.typingTimes.length + 1 // +1 for first key
      }
    };
  }

  compareProfiles(live: any, stored: any): number {
    if (!stored) return 0;

    const speedMatch = this.percentMatch(live.mouse.avgSpeed, stored.mouse.avgSpeed, 30);
    const distanceMatch = this.percentMatch(live.mouse.totalDistance, stored.mouse.totalDistance, 30);
    const typingMatch = this.percentMatch(live.typing.avgInterval, stored.typing.avgInterval, 30);

    // Average
    return (speedMatch + distanceMatch + typingMatch) / 3;
  }

  private percentMatch(live: number, stored: number, tolerance: number): number {
    const lower = stored * (1 - tolerance / 100);
    const upper = stored * (1 + tolerance / 100);
    return (live >= lower && live <= upper) ? 100 : 0;
  }
}
