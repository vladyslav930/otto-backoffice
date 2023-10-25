import { byMyndTableCell } from '@myndmanagement/test';
import { Spectator, createComponentFactory } from '@ngneat/spectator/jest';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';

import { InventoryStatus } from '../../../constants/inventory-status.constant';
import { IAssetInventory } from '../../../interfaces/asset-inventory.interface';
import { editAssetInventoryPressed } from '../../../store/asset-inventory/asset-inventory.actions';

import { AssetInventoryTableComponent } from './asset-inventory-table.component';

describe('AssetInventoryTableComponent', () => {
  let spectator: Spectator<AssetInventoryTableComponent>;
  const createComponent = createComponentFactory({
    component: AssetInventoryTableComponent,
    providers: [
      provideMockStore(),
    ],
  });

  const inventoryItem = {
    assetInventoryId: 'testedAssetInventoryId',
    details: {
      name: 'Microwave',
      status: InventoryStatus.Active,
      purchaseDate: '2020-09-09',
      cost: '500',
      warrantyExpirationDate: '2050-10-10',
      warrantyContactInfo: 'Microwave Repair Co',
    },
  } as IAssetInventory;

  beforeEach(() => {
    spectator = createComponent({
      props: {
        inventory: [inventoryItem],
      },
    });
    jest.spyOn(spectator.inject(Store), 'dispatch');
  });

  it('renders table with information about asset inventory', () => {
    const table = spectator.query('m-table');

    expect(spectator.query(byMyndTableCell(table, 'Name', 1))).toHaveExactText('Microwave');
    expect(spectator.query(byMyndTableCell(table, 'Status', 1))).toHaveExactText('Active');
    expect(spectator.query(byMyndTableCell(table, 'Purchase Date', 1))).toHaveExactText('09/09/2020');
    expect(spectator.query(byMyndTableCell(table, 'Cost', 1))).toHaveExactText('$500.00');
    expect(spectator.query(byMyndTableCell(table, 'Warranty Expiration', 1))).toHaveExactText('10/10/2050');
    expect(spectator.query(byMyndTableCell(table, 'Warranty Contact', 1))).toHaveExactText('Microwave Repair Co');
  });

  it('dispatches editAssetInventoryPressed when edit button is pressed on a row', () => {
    spectator.click('.edit-button');

    expect(spectator.inject(Store).dispatch)
      .toHaveBeenCalledWith(editAssetInventoryPressed({ inventory: inventoryItem }));
  });
});
