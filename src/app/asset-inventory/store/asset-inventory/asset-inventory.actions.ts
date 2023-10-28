import { IMyndAttachment } from '@myndmanagement/services-otto';
import { createAction, props } from '@ngrx/store';

import { LocationReferenceType } from '../../constants/location-reference-type.constant';
import { IAssetInventory, IAssetInventoryDetails } from '../../interfaces/asset-inventory.interface';

// Loading
export const assetInventoryComponentEntered = createAction(
  '[Asset Inventory] Component Entered',
  props<{ locationReferenceId: string, locationReferenceType: LocationReferenceType }>(),
);
export const retryPressed = createAction('[Asset Inventory] Retry Pressed');
export const assetInventoryLoaded = createAction(
  '[Asset Inventory] Loaded',
  props<{ inventory: IAssetInventory[] }>(),
);
export const assetInventoryNotLoaded = createAction('[Asset Inventory] Not Loaded', props<{ errorMessage: string }>());

// Controlling sidebar
export const addAssetInventoryPressed = createAction('[Asset Inventory] Add Pressed');
export const editAssetInventoryPressed = createAction(
  '[Asset Inventory] Edit Pressed',
  props<{ inventory: IAssetInventory }>(),
);
export const assetInventoryClosed = createAction('[Asset Inventory] Closed');

// Saving
export const assetInventoryFormSubmitted = createAction(
  '[Asset Inventory] Form Submitted',
  props<{
    isNew: boolean,
    details: IAssetInventoryDetails,
    fileIds: string[],
  }>(),
);
export const assetInventorySaved = createAction('[Asset Inventory] Saved');
export const assetInventoryNotSaved = createAction('[Asset Inventory] Not Saved');

// Delete
export const deleteAssetInventoryPressed = createAction('[Asset Inventory] Delete Pressed');
export const assetInventoryDeleted = createAction('[Asset Inventory] Deleted');
export const assetInventoryNotDeleted = createAction('[Asset Inventory] Not Deleted');

// TODO: Temporary until a proper component is implemented.
export const myndFilesLoaded = createAction(
  '[Mynd Attachments] Files Loaded',
  props<{ attachments: IMyndAttachment[], componentId?: number }>(),
);
