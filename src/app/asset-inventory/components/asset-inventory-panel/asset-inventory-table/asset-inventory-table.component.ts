import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { myndTrackByIdentity } from '@myndmanagement/common';
import { Store } from '@ngrx/store';

import { IAppState } from '../../../../root/store/reducers';
import { inventoryStatuses } from '../../../constants/inventory-status.constant';
import { IAssetInventory } from '../../../interfaces/asset-inventory.interface';
import { editAssetInventoryPressed } from '../../../store/asset-inventory/asset-inventory.actions';

@Component({
  selector: 'asset-inventory-table',
  templateUrl: 'asset-inventory-table.component.html',
  styleUrls: ['./asset-inventory-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssetInventoryTableComponent {

  @Input() inventory: IAssetInventory[];

  readonly inventoryStatuses = inventoryStatuses;
  readonly trackByInventoryId = myndTrackByIdentity<IAssetInventory>('assetInventoryId');

  constructor(
    private store: Store<IAppState>,
  ) {}

  onInventoryClicked(inventory: IAssetInventory): void {
    this.store.dispatch(editAssetInventoryPressed({ inventory }));
  }
}
