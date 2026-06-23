import { Signal } from '@angular/core';
import { Make } from '@domain/make.model';

export abstract class MakesPort {
  abstract readonly makes: Signal<Make[]>;
  abstract readonly loading: Signal<boolean>;
  abstract readonly error: Signal<string | null>;
}
