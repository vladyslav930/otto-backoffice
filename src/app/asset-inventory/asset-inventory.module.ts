import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MyndAttachmentsModule } from '@myndmanagement/attachments';
import { MyndCommonModule } from '@myndmanagement/common';
import { MyndFormsModule } from '@myndmanagement/forms';
import { MyndLayoutModule } from '@myndmanagement/layout';
import { MyndModalsModule } from '@myndmanagement/modals';
import { MyndTableModule } from '@myndmanagement/table';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { components } from './components';
import { AssetInventoryPanelComponent } from './components/asset-inventory-panel/asset-inventory-panel.component';
import { AssetInventoryService } from './services/asset-inventory.service';
import { AssetInventoryEffects } from './store/asset-inventory/asset-inventory.effects';
import { assetInventoryReducer, assetInventoryStateKey } from './store/asset-inventory/asset-inventory.reducer';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,

    MyndLayoutModule,
    MyndFormsModule,
    MyndModalsModule,
    MyndCommonModule,
    MyndTableModule,
    StoreModule.forFeature(assetInventoryStateKey, assetInventoryReducer),
    EffectsModule.forFeature([AssetInventoryEffects]),
    MyndAttachmentsModule,
  ],
  declarations: [
    ...components,
  ],
  exports: [
    AssetInventoryPanelComponent,
  ],
  providers: [
    AssetInventoryService,
  ],
})
export class AssetInventoryModule { }
