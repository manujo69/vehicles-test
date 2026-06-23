import { computed, inject, Injectable, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { MakeDetailPort } from './make-detail.port';
import { makeDetailFeature } from '../stores/make-detail.features';
import { makeDetailActions } from '../stores/make-detail.actions';

@Injectable()
export class MakeDetailNgRxAdapter extends MakeDetailPort {
  private readonly store = inject(Store);
  private readonly currentMakeId = signal<number | null>(null);
  private readonly entities = this.store.selectSignal(makeDetailFeature.selectEntities);

  readonly loading = this.store.selectSignal(makeDetailFeature.selectLoading);
  readonly detail = computed(() => {
    const id = this.currentMakeId();
    return id != null ? this.entities()[id] : undefined;
  });

  loadMakeDetail(makeId: number): void {
    this.currentMakeId.set(makeId);
    this.store.dispatch(makeDetailActions.loadMakeDetail({ makeId }));
  }
}
