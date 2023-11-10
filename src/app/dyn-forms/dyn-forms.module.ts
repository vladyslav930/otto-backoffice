import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MyndCommonModule } from '@myndmanagement/common';
import { MyndDynEditableGridModule } from '@myndmanagement/dyn-forms/editable-grid';
import { MyndFormsModule } from '@myndmanagement/forms';
import { MyndLayoutModule } from '@myndmanagement/layout';
import { MyndLayoutOttoModule } from '@myndmanagement/layout-otto';
import { MyndTooltipModule } from '@myndmanagement/tooltip';
import { MyndUiSearchModule } from '@myndmanagement/ui-search';
import { DynFormsModule } from '@myndpm/dyn-forms';
import { getModuleProviders } from '@myndpm/dyn-forms/core';

import { SharedModule } from '../shared/shared.module';

import { DynAutocompleteComponent, DynCodeboxComponent } from './components';

export const providers = getModuleProviders({
  controls: [
    {
      control: DynAutocompleteComponent.dynControl,
      instance: DynAutocompleteComponent.dynInstance,
      component: DynAutocompleteComponent,
    },
    {
      control: DynCodeboxComponent.dynControl,
      instance: DynCodeboxComponent.dynInstance,
      component: DynCodeboxComponent,
    },
  ],
  priority: 10,
});

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MyndCommonModule,
    MyndFormsModule,
    MyndTooltipModule,
    DynFormsModule,
    SharedModule,
    MyndUiSearchModule,
    MyndLayoutModule,
    MyndLayoutOttoModule,
    MyndDynEditableGridModule.forFeature(),
  ],
  declarations: [
    DynCodeboxComponent,
    DynAutocompleteComponent,
  ],
  exports: [
    MyndDynEditableGridModule,
  ],
})
export class BackOfficeFormsModule {
  static forFeature(): ModuleWithProviders<BackOfficeFormsModule> {
    return {
      providers,
      ngModule: BackOfficeFormsModule,
    };
  }
}
