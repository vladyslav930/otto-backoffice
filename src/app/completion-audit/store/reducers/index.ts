import { IMyndRouterSlice } from '@myndmanagement/store-select';

import { CompletionStoreType } from '../../../completion-audit-shared/store/reducers';

export type CompletionAuditStoreType =
  & CompletionStoreType
  & IMyndRouterSlice;
