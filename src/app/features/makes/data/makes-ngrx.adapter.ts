import { inject, Injectable } from '@angular/core';
import { MakesStore } from '../stores/makes.store';
import { MakesPort } from './makes.port';

@Injectable()
export class MakesNgRxAdapter extends MakesPort {
  private readonly store = inject(MakesStore);

  readonly makes = this.store.filteredMakes;
  readonly loading = this.store.loading;
  readonly filter = this.store.filter;

  loadMakes(): void {
    this.store.loadMakes();
  }

  setFilter(searchTerm: string): void {
    this.store.setFilter(searchTerm);
  }
}
