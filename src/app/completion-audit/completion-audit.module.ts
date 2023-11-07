import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { MyndCommonModule } from '@myndmanagement/common';
import { MyndFormsModule } from '@myndmanagement/forms';
import { MyndFormsOttoModule } from '@myndmanagement/forms-otto';
import { MyndLayoutModule } from '@myndmanagement/layout';
import { MyndModalsModule } from '@myndmanagement/modals';
import { MyndPropertiesModule } from '@myndmanagement/properties';
import { MyndTableModule } from '@myndmanagement/table';
import { MyndTooltipModule } from '@myndmanagement/tooltip';

import { CompletionAuditSharedModule } from '../completion-audit-shared/completion-audit-shared.module';
import {
  InstitutionalCompletenessResolver,
} from '../completion-audit-shared/resolvers/institutional-completeness.resolver';
import {
  InstitutionalIncompleteFieldsResolver,
} from '../completion-audit-shared/resolvers/institutional-incomplete-fields.resolver';
import { UnitDetailsResolver } from '../completion-audit-shared/resolvers/unit-details.resolver';
import { UnitsListResolver } from '../completion-audit-shared/resolvers/units-list.resolver';
import { SharedModule } from '../shared/shared.module';

import { completionAuditComponents } from './components/';
import { CompletionAuditComponent } from './components/completion-audit-layout/completion-audit-layout.component';
import { PropertyResolver } from './resolvers/property.resolver';

const routes: Routes = [
  {
    path: ':propertyId',
    component: CompletionAuditComponent,
    resolve: [
      PropertyResolver,
      InstitutionalCompletenessResolver,
      InstitutionalIncompleteFieldsResolver,
      UnitDetailsResolver,
      UnitsListResolver,
    ],
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
  },
];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),

    MyndCommonModule.forFeature(),
    MyndFormsModule,
    MyndFormsOttoModule,
    MyndLayoutModule,
    MyndTableModule,
    MyndModalsModule,
    MyndTooltipModule,
    MyndPropertiesModule,

    SharedModule,
    CompletionAuditSharedModule,
  ],
  declarations: [
    ...completionAuditComponents,
  ],
  providers: [
    PropertyResolver,
  ],
})
export class CompletionAuditModule {}
