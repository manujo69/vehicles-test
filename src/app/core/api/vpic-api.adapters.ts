import { Make } from '@domain/make.model';
import { VehicleType } from '@domain/vehicle-type.model';
import { VehicleModel } from '@domain/vehicle-model.model';
import { MakeDto, ModelDto, VehicleTypeDto } from './vpic.dto';

export const toMake = (dto: MakeDto): Make => ({
  id: dto.Make_ID,
  name: dto.Make_Name,
});

export const toVehicleType = (dto: VehicleTypeDto): VehicleType => ({
  id: dto.VehicleTypeId,
  name: dto.VehicleTypeName,
});

export const toVehicleModel = (dto: ModelDto): VehicleModel => ({
  id: dto.Model_ID,
  name: dto.Model_Name,
  makeName: dto.Make_Name,
});
