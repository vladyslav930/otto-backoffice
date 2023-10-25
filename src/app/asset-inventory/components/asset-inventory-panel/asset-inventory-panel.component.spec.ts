import { byMyndButton } from '@myndmanagement/test';
import { Spectator, createComponentFactory, mockProvider } from '@ngneat/spectator/jest';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';

import { LocationReferenceType } from '../../constants/location-reference-type.constant';
import { IAssetInventory } from '../../interfaces/asset-inventory.interface';
import { AssetInventoryService } from '../../services/asset-inventory.service';
import { AssetInventoryEffects } from '../../store/asset-inventory/asset-inventory.effects';
import { assetInventoryReducer, assetInventoryStateKey } from '../../store/asset-inventory/asset-inventory.reducer';

import { AssetInventoryPanelComponent } from './asset-inventory-panel.component';
import { AssetInventoryTableComponent } from './asset-inventory-table/asset-inventory-table.component';
import { EditAssetInventoryComponent } from './edit-asset-inventory/edit-asset-inventory.component';

describe('AssetInventoryPanelComponent', () => {
  let spectator: Spectator<AssetInventoryPanelComponent>;
  const createComponent = createComponentFactory({
    component: AssetInventoryPanelComponent,
    imports: [
      StoreModule.forRoot({
        [assetInventoryStateKey]: assetInventoryReducer,
      }),
      EffectsModule.forRoot([AssetInventoryEffects]),
    ],
    declarations: [
      MockComponent(AssetInventoryTableComponent),
      MockComponent(EditAssetInventoryComponent),
    ],
    providers: [
      mockProvider(AssetInventoryService, {
        list: jest.fn(() => of([
          { assetInventoryId: 'testedAssetInventoryId' },
        ] as IAssetInventory[])),
      }),
    ],
  });

  beforeEach(() => {
    spectator = createComponent({
      props: {
        locationReferenceType: LocationReferenceType.Property,
        locationReferenceId: 'testedPropertyId',
      },
    });
  });

  it('loads asset inventory and shows it in a table', () => {
    expect(spectator.inject(AssetInventoryService).list).toHaveBeenCalledWith(
      'testedPropertyId',
      LocationReferenceType.Property,
    );

    const table = spectator.query(AssetInventoryTableComponent);
    expect(table).toExist();
    expect(table.inventory).toEqual([{ assetInventoryId: 'testedAssetInventoryId' }]);
  });

  it('shows number of inventory items in panel header', () => {
    expect(spectator.query('.panel-title')).toHaveExactText('Assets (1)');
  });

  it('shows sidebar when Add button is pressed', () => {
    expect(spectator.query(EditAssetInventoryComponent)).not.toExist();
    spectator.click(spectator.query(byMyndButton('Asset')));

    expect(spectator.query(EditAssetInventoryComponent)).toExist();
  });
});
