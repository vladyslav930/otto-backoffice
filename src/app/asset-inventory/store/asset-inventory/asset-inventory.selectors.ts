import { createFeatureSelector, createSelector } from '@ngrx/store';

import { IAppState } from '../../../root/store/reducers';

import { IAssetInventoryState, assetInventoryStateKey } from './asset-inventory.reducer';

export const selectAssetInventoryState = createFeatureSelector<IAppState, IAssetInventoryState>(assetInventoryStateKey);

export const selectIsFormVisible = createSelector(
  selectAssetInventoryState,
  state => state.isFormVisible,
);

export const selectAssetInventory = createSelector(
  selectAssetInventoryState,
  state => state.inventory,
);

export const selectEditingInventory = createSelector(
  selectAssetInventoryState,
  state => state.editingInventory,
);

export const selectIsSaving = createSelector(
  selectAssetInventoryState,
  state => state.isSaving,
);

export const selectIsDeleting = createSelector(
  selectAssetInventoryState,
  state => state.isDeleting,
);
