import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Panel } from '../../../shared/component-classes/panel.class';
import { LocationReferenceType } from '../../constants/location-reference-type.constant';
import {
  addAssetInventoryPressed,
  assetInventoryComponentEntered,
  retryPressed,
} from '../../store/asset-inventory/asset-inventory.actions';
import {
  selectAssetInventory,
  selectAssetInventoryState,
  selectIsFormVisible,
} from '../../store/asset-inventory/asset-inventory.selectors';

@Component({
  selector: 'asset-inventory-panel',
  templateUrl: 'asset-inventory-panel.component.html',
  styleUrls: ['asset-inventory-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssetInventoryPanelComponent extends Panel implements OnInit {

  @Input() locationReferenceId: string;
  @Input() locationReferenceType: LocationReferenceType;

  expanded = true;

  title$ = this.store.select(selectAssetInventory).pipe(
    map((inventory) => {
      const inventoryCount = inventory.length;
      return inventoryCount ? `Assets (${inventoryCount})` : 'Assets';
    }),
  );
  state$ = this.store.select(selectAssetInventoryState);
  isFormVisible$: Observable<boolean> = this.store.select(selectIsFormVisible);

  constructor(
    private store: Store,
  ) {
    super();
  }

  ngOnInit(): void {
    this.store.dispatch(assetInventoryComponentEntered({
      locationReferenceId: this.locationReferenceId,
      locationReferenceType: this.locationReferenceType,
    }));
  }

  onAddPressed(): void {
    this.store.dispatch(addAssetInventoryPressed());
  }

  onRetryPressed(): void {
    this.store.dispatch(retryPressed());
  }
}
