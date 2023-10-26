import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MyndAttachmentsViewType, myndSelectAttachments } from '@myndmanagement/attachments';
import { MyndUnsubscriber, myndTakeFirstUntil } from '@myndmanagement/common';
import { Store } from '@ngrx/store';
import { pick } from 'lodash';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { IAppState } from '../../../../root/store/reducers';
import { expectedLifeSpanTypes } from '../../../constants/expected-life-span-type.constant';
import {
  InventoryStatus,
  inventoryStatuses,
  selectableInventoryStatuses,
} from '../../../constants/inventory-status.constant';
import { IAssetInventory } from '../../../interfaces/asset-inventory.interface';
import {
  assetInventoryClosed,
  assetInventoryFormSubmitted,
  deleteAssetInventoryPressed,
} from '../../../store/asset-inventory/asset-inventory.actions';
import {
  selectEditingInventory,
  selectIsDeleting,
  selectIsSaving,
} from '../../../store/asset-inventory/asset-inventory.selectors';

@Component({
  selector: 'edit-asset-inventory',
  templateUrl: 'edit-asset-inventory.component.html',
  styleUrls: ['edit-asset-inventory.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditAssetInventoryComponent extends MyndUnsubscriber implements OnInit {
  isSaving$: Observable<boolean> = this.store.select(selectIsSaving);
  isDeleting$: Observable<boolean> = this.store.select(selectIsDeleting);

  form = this.fb.group({
    name: [null, Validators.required],
    make: [],
    model: [],
    serialNumber: [],
    purchaseDate: [],
    cost: [],
    notes: [],
    status: [InventoryStatus.Active, Validators.required],
    expectedLifeSpanType: [],
    expectedLifeSpan: [],
    warrantyContactInfo: [],
    warrantyCompany: [],
    warrantyExpirationDate: [],
  });
  editingInventory: IAssetInventory;

  readonly inventoryStatuses = inventoryStatuses;
  readonly selectableInventoryStatuses = selectableInventoryStatuses;
  readonly expectedLifeSpanTypes = expectedLifeSpanTypes;
  readonly MyndAttachmentsViewType = MyndAttachmentsViewType;

  constructor(
    private store: Store<IAppState>,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
  ) {
    super();
  }

  get isNew(): boolean {
    return !this.editingInventory;
  }

  ngOnInit(): void {
    this.store.select(selectEditingInventory)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((editingInventory) => {
        this.editingInventory = editingInventory;
        this.updateForm();
        this.cdr.markForCheck();
      });
  }

  updateForm(): void {
    if (this.editingInventory) {
      this.form.patchValue(
        pick(this.editingInventory.details, [
          'name',
          'make',
          'model',
          'serialNumber',
          'purchaseDate',
          'cost',
          'notes',
          'status',
          'expectedLifeSpanType',
          'expectedLifeSpan',
          'warrantyContactInfo',
          'warrantyCompany',
          'warrantyExpirationDate',
        ]),
      );
    } else {
      this.form.reset();
      this.form.patchValue({
        status: InventoryStatus.Active,
      });
    }
  }

  onSubmit(): void {
    let fileIds: string[] = [];
    this.store.select(myndSelectAttachments)
      .pipe(myndTakeFirstUntil(this.unsubscribe))
      .subscribe((attachments) => {
        fileIds = attachments.map(attachment => attachment.fileId);
      });

    this.store.dispatch(assetInventoryFormSubmitted({
      fileIds,
      isNew: this.isNew,
      details: this.form.value,
    }));
  }

  onClose(): void {
    this.store.dispatch(assetInventoryClosed());
  }

  onDelete(): void {
    this.store.dispatch(deleteAssetInventoryPressed());
  }
}
