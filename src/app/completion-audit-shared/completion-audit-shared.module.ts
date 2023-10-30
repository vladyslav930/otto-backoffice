import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MyndCommonModule } from '@myndmanagement/common';
import { MyndCommonOttoModule } from '@myndmanagement/common-otto';
import { MyndFormsModule } from '@myndmanagement/forms';
import { MyndFormsOttoModule } from '@myndmanagement/forms-otto';
import { MyndLayoutModule } from '@myndmanagement/layout';
import { MyndModalsModule } from '@myndmanagement/modals';
import { MyndPropertiesModule } from '@myndmanagement/properties';
import { MyndTableModule } from '@myndmanagement/table';
import { MyndTooltipModule } from '@myndmanagement/tooltip';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { OnboardingSharedModule } from '../onboarding-shared/onboarding-shared.module';
import { PropertySharedModule } from '../property-shared/property-shared.module';
import { SharedModule } from '../shared/shared.module';
import { UnitsSharedModule } from '../units-shared/units-shared.module';

import { completionComponents } from './components';
import { resolvers } from './resolvers';
import { services } from './services';
import { completionEffects } from './store/effects';
import { completionReducer, completionStateKey } from './store/reducers/completion.reducer';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,

    StoreModule.forFeature(completionStateKey, completionReducer),
    EffectsModule.forFeature(completionEffects),

    MyndCommonModule.forFeature(),
    MyndCommonOttoModule,
    MyndFormsModule,
    MyndFormsOttoModule,

    MyndLayoutModule,
    MyndTableModule,
    MyndModalsModule,
    MyndTooltipModule,

    MyndPropertiesModule,
    PropertySharedModule,
    UnitsSharedModule,
    OnboardingSharedModule,

    SharedModule,
  ],
  declarations: [
    ...completionComponents,
  ],
  providers: [
    ...services,
    ...resolvers,
  ],
  exports: [
    ...completionComponents,
  ],
})
export class CompletionAuditSharedModule { }
