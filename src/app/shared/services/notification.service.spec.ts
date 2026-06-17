import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationService } from './notification.service';

describe('NotificationService', () => {
  let service: NotificationService;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;

  beforeEach(() => {
    snackBarSpy = jasmine.createSpyObj<MatSnackBar>('MatSnackBar', ['open']);
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), { provide: MatSnackBar, useValue: snackBarSpy }],
    });
    service = TestBed.inject(NotificationService);
  });

  it('calls snackBar.open with the provided message', () => {
    service.error('Something went wrong');
    expect(snackBarSpy.open).toHaveBeenCalledOnceWith('Something went wrong', 'Cerrar', jasmine.any(Object));
  });

  it('opens the snackbar with duration 5000', () => {
    service.error('err');
    const config = snackBarSpy.open.calls.mostRecent().args[2] as Record<string, unknown>;
    expect(config['duration']).toBe(5000);
  });

  it('applies snackbar-error panel class', () => {
    service.error('err');
    const config = snackBarSpy.open.calls.mostRecent().args[2] as Record<string, unknown>;
    expect(config['panelClass']).toBe('snackbar-error');
  });

  it('positions the snackbar at center/bottom', () => {
    service.error('err');
    const config = snackBarSpy.open.calls.mostRecent().args[2] as Record<string, unknown>;
    expect(config['horizontalPosition']).toBe('center');
    expect(config['verticalPosition']).toBe('bottom');
  });
});
