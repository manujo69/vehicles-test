import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { MakesPort } from './makes.port';
import { makesFeature } from '../stores/makes-features';
import { makesActions } from '../stores/makes-actions';

@Injectable()
export class MakesNgRxAdapter extends MakesPort {
  private readonly store = inject(Store);

  readonly makes = this.store.selectSignal(makesFeature.selectFilteredMakes);
  readonly loading = this.store.selectSignal(makesFeature.selectLoading);
  readonly filter = this.store.selectSignal(makesFeature.selectFilter);

  loadMakes(): void {
    this.store.dispatch(makesActions.loadMakes());
  }

  setFilter(searchTerm: string): void {
    this.store.dispatch(makesActions.setFilter({ searchTerm }));
  }
}
