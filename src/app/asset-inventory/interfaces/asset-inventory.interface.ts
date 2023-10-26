import { IMyndFile } from '@myndmanagement/services-otto';

import { ExpectedLifeSpanType } from '../constants/expected-life-span-type.constant';
import { InventoryStatus } from '../constants/inventory-status.constant';
import { LocationReferenceType } from '../constants/location-reference-type.constant';

export interface IAssetInventory {
  assetInventoryId: string;
  locationReferenceId: string;
  locationReferenceType: LocationReferenceType;
  details: IAssetInventoryDetails;
  files: IMyndFile[];
}

export interface IAssetInventoryDetails {
  name: string;
  make: string;
  model: string;
  serialNumber: string;
  purchaseDate: string;
  cost: string;
  notes: string;
  status: InventoryStatus;
  expectedLifeSpanType: ExpectedLifeSpanType;
  expectedLifeSpan: string;
  warrantyContactInfo: string;
  warrantyCompany: string;
  warrantyExpirationDate: string;
}

export interface ICreateAssetInventory {
  locationReferenceId: string;
  locationReferenceType: LocationReferenceType;
  details: IAssetInventoryDetails;
  fileIds: string[];
}
export interface IUpdateAssetInventory {
  assetInventoryId: string;
  details: IAssetInventoryDetails;
  fileIds: string[];
}
