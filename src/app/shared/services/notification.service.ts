import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MESSAGES } from '../consts/i18n-messages';

const NOTIFICATION_DURATION_MS = 5000;
@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly snackBar = inject(MatSnackBar);

  error(message: string): void {
    this.snackBar.open(message, MESSAGES.common.close, {
      duration: NOTIFICATION_DURATION_MS,
      panelClass: 'snackbar-error',
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }
}
