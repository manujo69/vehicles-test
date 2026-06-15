import { createActionGroup, props } from '@ngrx/store';
import { VehicleType } from '@domain/vehicle-type.model';
import { VehicleModel } from '@domain/vehicle-model.model';

export const makeDetailActions = createActionGroup({
  source: 'Make Detail',
  events: {
    'Load Make Detail': props<{ makeId: number }>(),
    'Load Make Detail Success':
      props<{ makeId: number; types: VehicleType[]; models: VehicleModel[] }>(),
    'Load Make Detail Failure': props<{ makeId: number; error: string }>(),

    'Load Models By Type': props<{ makeId: number; vehicleType: string }>(),
    'Load Models By Type Success':
      props<{ makeId: number; vehicleType: string; models: VehicleModel[] }>(),
    'Load Models By Type Failure':
      props<{ makeId: number; vehicleType: string; error: string }>(),
  },
});
