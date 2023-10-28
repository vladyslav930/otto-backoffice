import { Action, createReducer, on } from '@ngrx/store';

import { LocationReferenceType } from '../../constants/location-reference-type.constant';
import { IAssetInventory } from '../../interfaces/asset-inventory.interface';

import * as fromActions from './asset-inventory.actions';

export interface IAssetInventoryState {
  locationReferenceId: string;
  locationReferenceType: LocationReferenceType;

  inventory: IAssetInventory[];
  isLoading: boolean;
  errorMessage: string;

  isFormVisible: boolean;
  editingInventory: IAssetInventory;
  isSaving: boolean;

  isDeleting: boolean;
}

const initialState: IAssetInventoryState = {
  locationReferenceId: null,
  locationReferenceType: null,

  inventory: [],
  isLoading: false,
  errorMessage: null,

  isFormVisible: false,
  editingInventory: null,
  isSaving: false,

  isDeleting: false,
};

export const assetInventoryStateKey = 'assetInventory';

export interface IAssetInventorySlice {
  [assetInventoryStateKey]: IAssetInventoryState;
}

export function assetInventoryReducer(state: IAssetInventoryState | undefined, action: Action): IAssetInventoryState {
  return reducer(state, action);
}

const reducer = createReducer<IAssetInventoryState>(
  initialState,

  // Loading
  on(fromActions.assetInventoryComponentEntered, (state, { locationReferenceId, locationReferenceType }) => {
    return {
      ...state,
      locationReferenceId,
      locationReferenceType,
      isLoading: true,
    };
  }),
  on(fromActions.assetInventoryLoaded, (state, { inventory }) => ({ ...state, inventory, isLoading: false })),
  on(fromActions.assetInventoryNotLoaded, (state, { errorMessage }) => ({ ...state, errorMessage, isLoading: false })),

  // Controlling sidebar
  on(fromActions.addAssetInventoryPressed, state => ({ ...state, isFormVisible: true, editingInventory: null })),
  on(fromActions.editAssetInventoryPressed, (state, { inventory }) => {
    return {
      ...state,
      editingInventory: inventory,
      isFormVisible: true,
    };
  }),
  on(fromActions.assetInventoryClosed, state => ({ ...state, isFormVisible: false })),

  // Saving
  on(fromActions.assetInventoryFormSubmitted, state => ({ ...state, isSaving: true })),
  on(fromActions.assetInventorySaved, state => ({ ...state, isSaving: false, isFormVisible: false })),
  on(fromActions.assetInventoryNotSaved, state => ({ ...state, isSaving: false })),

  // Removing
  on(fromActions.deleteAssetInventoryPressed, state => ({ ...state, isDeleting: true })),
  on(fromActions.assetInventoryDeleted, state => ({ ...state, isDeleting: false, isFormVisible: false })),
  on(fromActions.assetInventoryNotDeleted, state => ({ ...state, isDeleting: false })),
);
