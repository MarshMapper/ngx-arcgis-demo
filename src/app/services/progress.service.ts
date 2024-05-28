import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

// simple shared service to track when work is in progress so that feedback can be provided to the user
@Injectable({
  providedIn: 'root'
})
export class ProgressService {
  public workInProgress: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  constructor() { }
  getWorkInProgress(): Observable<boolean> {
    return this.workInProgress.asObservable();
  }
  setWorkInProgress(value: boolean): void {
    this.workInProgress.next(value);
  }
}
