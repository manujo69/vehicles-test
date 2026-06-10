export interface VpicResponse<T> {
  Count: number;
  Message: string;
  SearchCriteria: string | null;
  Results: T[];
}

export interface MakeDto {
  Make_ID: number;
  Make_Name: string;
}

export interface VehicleTypeDto {
  VehicleTypeId: number;
  VehicleTypeName: string;
}

export interface ModelDto {
  Make_ID: number;
  Make_Name: string;
  Model_ID: number;
  Model_Name: string;
}
