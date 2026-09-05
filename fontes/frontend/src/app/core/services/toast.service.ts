import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

export interface ToastMessage {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastsSubject = new Subject<ToastMessage>();
  private nextId = 0;

  getToasts(): Observable<ToastMessage> {
    return this.toastsSubject.asObservable();
  }

  show(message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info', duration: number = 3000) {
    this.toastsSubject.next({
      id: this.nextId++,
      message,
      type,
      duration
    });
  }

  showSuccess(message: string, duration?: number) {
    this.show(message, 'success', duration);
  }

  showError(message: string, duration?: number) {
    this.show(message, 'error', duration);
  }

  showInfo(message: string, duration?: number) {
    this.show(message, 'info', duration);
  }

  showWarning(message: string, duration?: number) {
    this.show(message, 'warning', duration);
  }
}
