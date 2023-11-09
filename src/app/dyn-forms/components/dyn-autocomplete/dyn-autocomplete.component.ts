import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DynConfig, DynControlMode, DynFormControl, DynPartialControlConfig } from '@myndpm/dyn-forms/core';

import { IDynAutocompleteParams } from './dyn-autocomplete.component.params';

@Component({
  selector: 'dyn-autocomplete',
  templateUrl: './dyn-autocomplete.component.html',
  styleUrls: ['./dyn-autocomplete.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynAutocompleteComponent
extends DynFormControl<DynControlMode, IDynAutocompleteParams> {

  static dynControl: 'AUTOCOMPLETE' = 'AUTOCOMPLETE';

  static createConfig<M extends DynControlMode>(
    partial: DynPartialControlConfig<M, IDynAutocompleteParams>,
  ): DynConfig<M> {
    return {
      ...partial,
      control: DynAutocompleteComponent.dynControl,
    };
  }

  completeParams(params: Partial<IDynAutocompleteParams>): IDynAutocompleteParams {
    return params as IDynAutocompleteParams;
  }
}
