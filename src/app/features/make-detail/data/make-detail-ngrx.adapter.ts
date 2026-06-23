import { inject, Injectable } from '@angular/core';
import { MakeDetailStore } from '../stores/make-detail.store';
import { MakeDetailPort } from './make-detail.port';

@Injectable()
export class MakeDetailNgRxAdapter extends MakeDetailPort {
  private readonly store = inject(MakeDetailStore);

  readonly loading = this.store.loading;
  readonly details = this.store.details;

  loadMakeDetail(makeId: number): void {
    this.store.loadMakeDetail(makeId);
  }
}
