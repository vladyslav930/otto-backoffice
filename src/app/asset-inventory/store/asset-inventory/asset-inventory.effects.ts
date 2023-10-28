import { Injectable } from '@angular/core';
import { myndHttpErrorResponseToMessage } from '@myndmanagement/common';
import { MyndToastrService } from '@myndmanagement/toast';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';

import { IAppState } from '../../../root/store/reducers';
import { AssetInventoryService } from '../../services/asset-inventory.service';
import { getFilesAsAttachments } from '../../utils/get-files-as-attachments.utilts';

import * as fromActions from './asset-inventory.actions';
import { selectAssetInventoryState, selectEditingInventory } from './asset-inventory.selectors';

@Injectable()
export class AssetInventoryEffects {
  load$ = createEffect(() => this.actions$.pipe(
    ofType(
      fromActions.assetInventoryComponentEntered,
      fromActions.retryPressed,
      fromActions.assetInventorySaved,
      fromActions.assetInventoryDeleted,
    ),
    withLatestFrom(this.store.select(selectAssetInventoryState)),
    switchMap(([_, state]) => {
      return this.assetInventoryService.list(state.locationReferenceId, state.locationReferenceType).pipe(
        map(inventory => fromActions.assetInventoryLoaded({ inventory })),
        catchError((response) => {
          const errorMessage = myndHttpErrorResponseToMessage(response);
          return of(fromActions.assetInventoryNotLoaded({ errorMessage }));
        }),
      );
    }),
  ));

  save$ = createEffect(() => this.actions$.pipe(
    ofType(fromActions.assetInventoryFormSubmitted),
    withLatestFrom(this.store.select(selectAssetInventoryState)),
    switchMap(([{ isNew, details, fileIds }, { locationReferenceId, locationReferenceType, editingInventory }]) => {
      return (
        isNew
          ? this.assetInventoryService.create({
            locationReferenceId,
            locationReferenceType,
            details,
            fileIds,
          })
          : this.assetInventoryService.update({
            details,
            fileIds,
            assetInventoryId: editingInventory.assetInventoryId,
          })
      ).pipe(
        map(() => fromActions.assetInventorySaved()),
        this.toastr.catchServerError(fromActions.assetInventoryNotSaved()),
      );
    }),
  ));

  // TODO: Only needed to make m-attachments work with files. Replace with proper implementation.
  setAttachmentsOnOpen$ = createEffect(() => this.actions$.pipe(
    ofType(fromActions.editAssetInventoryPressed),
    map(({ inventory }) => {
      return fromActions.myndFilesLoaded({
        attachments: getFilesAsAttachments(inventory.files),
      });
    }),
  ));

  delete$ = createEffect(() => this.actions$.pipe(
    ofType(fromActions.deleteAssetInventoryPressed),
    withLatestFrom(this.store.select(selectEditingInventory)),
    switchMap(([_, { assetInventoryId }]) => {
      return this.assetInventoryService.remove(assetInventoryId).pipe(
        map(() => fromActions.assetInventoryDeleted()),
        this.toastr.catchServerError(fromActions.assetInventoryNotDeleted()),
      );
    }),
  ));

  constructor(
    private actions$: Actions,
    private store: Store<IAppState>,
    private toastr: MyndToastrService,
    private assetInventoryService: AssetInventoryService,
  ) {}
}
