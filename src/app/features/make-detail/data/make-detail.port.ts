import { Signal } from '@angular/core';
import { MakeDetail } from '../stores/make-detail.features';

export abstract class MakeDetailPort {
  abstract readonly loading: Signal<boolean>;
  abstract readonly detail: Signal<MakeDetail | undefined>;
  abstract loadMakeDetail(makeId: number): void;
}
