import { fakeAsync } from '@angular/core/testing';
import { MyndAttachmentsModule } from '@myndmanagement/attachments';
import { byMyndButton, byMyndControl } from '@myndmanagement/test';
import { Spectator, createComponentFactory, mockProvider } from '@ngneat/spectator/jest';
import { EffectsModule } from '@ngrx/effects';
import { Store, StoreModule } from '@ngrx/store';
import { of } from 'rxjs';

import { ExpectedLifeSpanType } from '../../../constants/expected-life-span-type.constant';
import { InventoryStatus } from '../../../constants/inventory-status.constant';
import { LocationReferenceType } from '../../../constants/location-reference-type.constant';
import { IAssetInventoryDetails } from '../../../interfaces/asset-inventory.interface';
import { AssetInventoryService } from '../../../services/asset-inventory.service';
import { addAssetInventoryPressed } from '../../../store/asset-inventory/asset-inventory.actions';
import { AssetInventoryEffects } from '../../../store/asset-inventory/asset-inventory.effects';
import {
  IAssetInventoryState,
  assetInventoryReducer,
  assetInventoryStateKey,
} from '../../../store/asset-inventory/asset-inventory.reducer';

import { EditAssetInventoryComponent } from './edit-asset-inventory.component';

describe('EditAssetInventoryComponent', () => {
  let spectator: Spectator<EditAssetInventoryComponent>;
  let api: AssetInventoryService;
  const createComponent = createComponentFactory({
    component: EditAssetInventoryComponent,
    imports: [
      StoreModule.forRoot({
        [assetInventoryStateKey]: assetInventoryReducer,
      }, {
        initialState: {
          [assetInventoryStateKey]: {
            locationReferenceId: 'testedReferenceId',
            locationReferenceType: LocationReferenceType.Unit,
            editingInventory: {
              assetInventoryId: 'testedAssetInventoryId',
              details: {
                name: 'Microwave',
                make: 'Ray Co',
                model: 'Model A',
                serialNumber: 'A123-456',
                purchaseDate: '2020-09-10',
                cost: '500',
                notes: 'User must go to another room when microwave is on',
                status: InventoryStatus.Active,
                expectedLifeSpanType: ExpectedLifeSpanType.Years,
                expectedLifeSpan: '30',
                warrantyContactInfo: 'no-reply@microrepair.co',
                warrantyCompany: 'Microrepair',
                warrantyExpirationDate: '2050-08-10',
              },
              files: [],
            },
          } as IAssetInventoryState,
        },
      }),

      EffectsModule.forRoot([AssetInventoryEffects]),
      MyndAttachmentsModule,
    ],
    providers: [
      mockProvider(AssetInventoryService, {
        list: jest.fn(() => of()),
        update: jest.fn(() => of({})),
        create: jest.fn(() => of({})),
        remove: jest.fn(() => of({})),
      }),
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    api = spectator.inject(AssetInventoryService);
  });

  it('shows values for existing inventory when it is being edited', () => {
    const getField = (label: string) => spectator.query(byMyndControl(label));

    expect(getField('Name').querySelector('input')).toHaveValue('Microwave');
    expect(getField('Make').querySelector('input')).toHaveValue('Ray Co');
    expect(getField('Model').querySelector('input')).toHaveValue('Model A');
    expect(getField('Serial Number').querySelector('input')).toHaveValue('A123-456');
    expect(getField('Purchase Date').querySelector('input')).toHaveValue('09/10/2020');
    expect(getField('Cost').querySelector('input')).toHaveValue('$500.00');
    expect(getField('Notes').querySelector('textarea'))
      .toHaveValue('User must go to another room when microwave is on');
    expect(getField('Status')).toHaveText('Active');
    expect(spectator.query('.expected-life-span input')).toHaveValue('30');
    expect(spectator.query('.expected-life-span-type')).toHaveText('Years');
    expect(getField('Warranty Contact Info').querySelector('textarea')).toHaveValue('no-reply@microrepair.co');
    expect(getField('Warranty Company').querySelector('input')).toHaveValue('Microrepair');
    expect(getField('Warranty Expiration Date').querySelector('input')).toHaveValue('08/10/2050');
  });

  const fillForm = () => {
    spectator.fillForm([
      { in: byMyndControl('Name'), value: 'Refrigerator' },
      { in: byMyndControl('Make'), value: 'Big Cold' },
      { in: byMyndControl('Model'), value: 'CLD-12' },
      { in: byMyndControl('Serial Number'), value: 'A22388-23' },
      { in: byMyndControl('Purchase Date'), value: '2020-09-10' },
      { in: byMyndControl('Cost'), value: '400' },
      { in: byMyndControl('Notes'), value: 'Can fit a medium sized child inside' },
      { in: byMyndControl('Status'), value: 'Inactive' },
      { in: '.expected-life-span', value: '2' },
      { in: '.expected-life-span-type', value: 'Weeks' },
      { in: byMyndControl('Warranty Contact Info'), value: '+122344422' },
      { in: byMyndControl('Warranty Company'), value: 'Repair Co' },
      { in: byMyndControl('Warranty Expiration Date'), value: '2021-01-09' },
    ]);
  };
  const expectedInventoryDetails = {
    cost: '400.00',
    expectedLifeSpan: '2',
    expectedLifeSpanType: ExpectedLifeSpanType.Weeks,
    make: 'Big Cold',
    model: 'CLD-12',
    name: 'Refrigerator',
    notes: 'Can fit a medium sized child inside',
    purchaseDate: '2020-09-10',
    serialNumber: 'A22388-23',
    status: InventoryStatus.Inactive,
    warrantyCompany: 'Repair Co',
    warrantyContactInfo: '+122344422',
    warrantyExpirationDate: '2021-01-09',
  } as IAssetInventoryDetails;

  it('allows to edit existing inventory', fakeAsync(() => {
    fillForm();

    spectator.click(spectator.query(byMyndButton('Save')));

    expect(api.update).toHaveBeenCalledWith({
      assetInventoryId: 'testedAssetInventoryId',
      details: expectedInventoryDetails,
      fileIds: [],
    });
  }));

  it('allows to create new inventory', fakeAsync(() => {
    spectator.inject(Store).dispatch(addAssetInventoryPressed());
    spectator.detectComponentChanges();

    fillForm();

    spectator.click(spectator.query(byMyndButton('Save')));

    expect(api.create).toHaveBeenCalledWith({
      locationReferenceId: 'testedReferenceId',
      locationReferenceType: LocationReferenceType.Unit,
      details: expectedInventoryDetails,
      fileIds: [],
    });
  }));

  it('allows existing inventory to be deleted', () => {
    spectator.click(spectator.query(byMyndButton('Delete')));
    spectator.click(spectator.query(byMyndButton('Yes'), { root: true }));

    expect(api.remove).toHaveBeenCalledWith('testedAssetInventoryId');
  });
});
