import { IMyndPropertiesSlice } from '@myndmanagement/properties';
import { IMyndRouterSlice } from '@myndmanagement/store-select';

import { IPropertyFeatureSlice } from '../../../property-shared/store/reducers';
import { IUnitsFeatureSlice } from '../../../units-shared/store/reducers/units-feature.reducer';

import { ICompletionSlice } from './completion.reducer';

export type CompletionStoreType =
  & ICompletionSlice
  & IPropertyFeatureSlice
  & IUnitsFeatureSlice
  & IMyndPropertiesSlice
  & IMyndRouterSlice;
