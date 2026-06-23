import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { MakesStore } from './makes.store';
import { VpicApiPort } from '@core/api/vpic-api.port';
import { NotificationService } from '@shared/services/notification.service';
import { MAKES_MOCK } from '@shared/consts/testing.constants';

describe('MakesStore', () => {
  let store: InstanceType<typeof MakesStore>;
  let apiSpy: jasmine.SpyObj<VpicApiPort>;
  let notificationSpy: jasmine.SpyObj<NotificationService>;

  beforeEach(() => {
    apiSpy = jasmine.createSpyObj<VpicApiPort>('VpicApiPort', ['getAllMakes']);
    notificationSpy = jasmine.createSpyObj<NotificationService>('NotificationService', ['error']);

    TestBed.configureTestingModule({
      providers: [
        MakesStore,
        { provide: VpicApiPort, useValue: apiSpy },
        { provide: NotificationService, useValue: notificationSpy },
      ],
    });

    store = TestBed.inject(MakesStore);
  });

  it('has correct initial state', () => {
    expect(store.makes()).toEqual([]);
    expect(store.filter()).toBe('');
    expect(store.loading()).toBeFalse();
    expect(store.loaded()).toBeFalse();
    expect(store.error()).toBeNull();
    expect(store.filteredMakes()).toEqual([]);
  });

  describe('loadMakes()', () => {
    it('loads makes and sets loaded flag on success', fakeAsync(() => {
      apiSpy.getAllMakes.and.returnValue(of(MAKES_MOCK));

      store.loadMakes();
      tick();

      expect(store.makes()).toEqual(MAKES_MOCK);
      expect(store.loading()).toBeFalse();
      expect(store.loaded()).toBeTrue();
    }));

    it('does not call API when already loaded', fakeAsync(() => {
      apiSpy.getAllMakes.and.returnValue(of(MAKES_MOCK));
      store.loadMakes();
      tick();

      store.loadMakes();
      tick();

      expect(apiSpy.getAllMakes).toHaveBeenCalledTimes(1);
    }));

    it('sets error and notifies on failure', fakeAsync(() => {
      apiSpy.getAllMakes.and.returnValue(throwError(() => new Error('Network error')));

      store.loadMakes();
      tick();

      expect(store.error()).toBe('Network error');
      expect(store.loading()).toBeFalse();
      expect(notificationSpy.error).toHaveBeenCalledWith('Network error');
    }));
  });

  describe('setFilter()', () => {
    it('updates the filter', () => {
      store.setFilter('toy');
      expect(store.filter()).toBe('toy');
    });

    it('clears the filter', () => {
      store.setFilter('toy');
      store.setFilter('');
      expect(store.filter()).toBe('');
    });
  });

  describe('filteredMakes()', () => {
    beforeEach(fakeAsync(() => {
      apiSpy.getAllMakes.and.returnValue(of(MAKES_MOCK));
      store.loadMakes();
      tick();
    }));

    it('returns all makes when filter is empty', () => {
      expect(store.filteredMakes()).toEqual(MAKES_MOCK);
    });

    it('filters case-insensitively', () => {
      store.setFilter('toy');
      expect(store.filteredMakes()).toEqual([{ id: 1, name: 'TOYOTA' }]);
    });

    it('trims whitespace from the filter term', () => {
      store.setFilter('  honda  ');
      expect(store.filteredMakes()).toEqual([{ id: 2, name: 'HONDA' }]);
    });

    it('returns empty array when no makes match', () => {
      store.setFilter('zzz');
      expect(store.filteredMakes()).toEqual([]);
    });

    it('matches partial names', () => {
      store.setFilter('M');
      expect(store.filteredMakes()).toEqual([{ id: 3, name: 'BMW' }]);
    });
  });
});
