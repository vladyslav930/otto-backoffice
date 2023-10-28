import { A11yModule } from '@angular/cdk/a11y';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MyndCommonModule } from '@myndmanagement/common';
import { MyndCommonOttoModule } from '@myndmanagement/common-otto';
import { MyndHistoryModule } from '@myndmanagement/history';
import { MyndLayoutModule } from '@myndmanagement/layout';
import { MyndLayoutOttoModule } from '@myndmanagement/layout-otto';
import { MyndModalsModule } from '@myndmanagement/modals';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { SharedModule } from '../shared/shared.module';

import { components } from './components';
import { services } from './services';
import { effects } from './store/effects';
import { auditHistoryReducer, auditHistoryStateKey } from './store/reducers/audit-history.reducer';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    A11yModule,

    MyndCommonModule,
    MyndCommonOttoModule,
    MyndLayoutModule,
    MyndLayoutOttoModule,
    MyndModalsModule,
    MyndHistoryModule,
    StoreModule.forFeature(auditHistoryStateKey, auditHistoryReducer),
    EffectsModule.forFeature(effects),
    SharedModule,
  ],
  declarations: [
    ...components,
  ],
  providers: [
    ...services,
  ],
})
export class AuditHistoryModule {
}
