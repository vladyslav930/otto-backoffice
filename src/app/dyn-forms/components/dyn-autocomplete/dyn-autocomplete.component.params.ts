import { DynControlParams } from '@myndpm/dyn-forms/core';
import { Observable } from 'rxjs';

export interface IDynAutocompleteParams extends DynControlParams {
  search: (str: string) => Observable<{ name: string }[]>;
  addNewItem?: (str: string) => Observable<{ name: string }>;
  addNewItemDisplayName?: ((str: string) => string) | string;
}
