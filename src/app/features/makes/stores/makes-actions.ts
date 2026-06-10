import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Make } from '../../../domain/make.model';

export const makesActions = createActionGroup({
  source: 'Makes',
  events: {
    'Load Makes': emptyProps(),
    'Load Makes Success': props<{ makes: Make[] }>(),
    'Load Makes Failure': props<{ error: string }>(),
    'Set Filter': props<{ term: string }>(),
  },
});
