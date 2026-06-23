import { Signal } from '@angular/core';
import { MakeDetail } from '../stores/make-detail.store';

export abstract class MakeDetailPort {
  abstract readonly loading: Signal<boolean>;
  abstract readonly details: Signal<Record<number, MakeDetail>>;
  abstract loadMakeDetail(makeId: number): void;
}
