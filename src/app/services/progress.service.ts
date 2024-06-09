import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

// simple shared service to track when work is in progress so that feedback can be provided to the user.
// allows for multiple components to set the work in progress state and will track when the last is compoleted.
@Injectable({
  providedIn: 'root'
})
export class ProgressService {
  public workInProgress: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private inProgressCount: number = 0;

  constructor() { }
  getWorkInProgress(): Observable<boolean> {
    return this.workInProgress.asObservable();
  }
  setWorkInProgress(value: boolean): void {
    if (value) {
      if (this.inProgressCount === 0) {
        this.workInProgress.next(true);
      }
      this.inProgressCount++;
    } else {
      if (this.inProgressCount === 0) {
        return;
      }
      if (! --this.inProgressCount) {
        this.workInProgress.next(false);
      }
    }
  }
}
