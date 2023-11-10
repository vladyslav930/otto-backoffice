import { DynConfig, DynControlMode, DynControlType, DynPartialControlConfig } from '@myndpm/dyn-forms/core';

import { DynAutocompleteComponent, DynCodeboxComponent, IDynAutocompleteParams, IDynCodeboxParams } from './components';

// type overloads
export function createBoConfig<M extends DynControlMode>(
  type: typeof DynAutocompleteComponent.dynControl,
  partial: DynPartialControlConfig<M, Partial<IDynAutocompleteParams>>,
): DynConfig<M>;
export function createBoConfig<M extends DynControlMode>(
  type: typeof DynCodeboxComponent.dynControl,
  partial: DynPartialControlConfig<M, Partial<IDynCodeboxParams>>,
): DynConfig<M>;

// factory
export function createBoConfig<M extends DynControlMode>(
  type: DynControlType,
  // tslint:disable-next-line: no-any
  partial: any,
): DynConfig<M> {
  switch (type) {
    case DynAutocompleteComponent.dynControl:
      return DynAutocompleteComponent.createConfig(partial);
    case DynCodeboxComponent.dynControl:
      return DynCodeboxComponent.createConfig(partial);
  }
}
