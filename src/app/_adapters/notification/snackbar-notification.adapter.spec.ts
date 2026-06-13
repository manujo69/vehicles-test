import { TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarNotificationAdapter } from './snackbar-notification.adapter';
import { NotificationPort } from '@core/notification.port';

describe('SnackbarNotificationAdapter', () => {
  let adapter: NotificationPort;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;

  beforeEach(() => {
    snackBarSpy = jasmine.createSpyObj<MatSnackBar>('MatSnackBar', ['open']);
    TestBed.configureTestingModule({
      providers: [
        { provide: MatSnackBar, useValue: snackBarSpy },
        { provide: NotificationPort, useClass: SnackbarNotificationAdapter },
      ],
    });
    adapter = TestBed.inject(NotificationPort);
  });

  it('calls snackBar.open with the provided message', () => {
    adapter.error('Something went wrong');
    expect(snackBarSpy.open).toHaveBeenCalledOnceWith('Something went wrong', 'Cerrar', jasmine.any(Object));
  });

  it('opens the snackbar with duration 5000', () => {
    adapter.error('err');
    const config = snackBarSpy.open.calls.mostRecent().args[2] as Record<string, unknown>;
    expect(config['duration']).toBe(5000);
  });

  it('applies snackbar-error panel class', () => {
    adapter.error('err');
    const config = snackBarSpy.open.calls.mostRecent().args[2] as Record<string, unknown>;
    expect(config['panelClass']).toBe('snackbar-error');
  });

  it('positions the snackbar at center/bottom', () => {
    adapter.error('err');
    const config = snackBarSpy.open.calls.mostRecent().args[2] as Record<string, unknown>;
    expect(config['horizontalPosition']).toBe('center');
    expect(config['verticalPosition']).toBe('bottom');
  });
});
