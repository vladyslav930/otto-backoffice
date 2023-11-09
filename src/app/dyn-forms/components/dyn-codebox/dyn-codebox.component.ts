import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DynConfig, DynControlMode, DynFormControl, DynPartialControlConfig } from '@myndpm/dyn-forms/core';

import { IDynCodeboxParams } from './dyn-codebox.component.params';

@Component({
  selector: 'dyn-codebox',
  templateUrl: './dyn-codebox.component.html',
  styleUrls: ['./dyn-codebox.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynCodeboxComponent
extends DynFormControl<DynControlMode, IDynCodeboxParams> {

  static dynControl: 'CODEBOX' = 'CODEBOX';

  static createConfig<M extends DynControlMode>(
    partial: DynPartialControlConfig<M, IDynCodeboxParams>,
  ): DynConfig<M> {
    return {
      ...partial,
      control: DynCodeboxComponent.dynControl,
    };
  }

  completeParams(params: Partial<IDynCodeboxParams>): IDynCodeboxParams {
    return params as IDynCodeboxParams;
  }
}
