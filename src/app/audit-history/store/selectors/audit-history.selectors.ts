import { createFeatureSelector, createSelector } from '@ngrx/store';

import { auditHistoryPageLimit } from '../../interfaces/audit-history-params.interface';
import { IAuditEvent } from '../../interfaces/audit-history.interface';
import { transformUnitPropertyStructure } from '../../utils/action-history-transform-fns';
import {
  IAuditHistorySlice,
  IAuditHistoryState,
  auditHistoryAdapter,
  auditHistoryStateKey,
} from '../reducers/audit-history.reducer';

export const selectAuditHistoryModule = createFeatureSelector<IAuditHistorySlice, IAuditHistoryState>(auditHistoryStateKey);

export const {
  selectAll,
  selectTotal,
} = auditHistoryAdapter.getSelectors(selectAuditHistoryModule);

export const selectCurrentPageAuditHistoryEvents = createSelector(
  selectAuditHistoryModule,
  selectAll,
  (state: IAuditHistoryState, auditEvents: IAuditEvent[]) => {
    return auditEvents.slice(state.offset, state.offset + auditHistoryPageLimit);
  },
);

export const selectTotalAuditEventsCount = selectTotal;

export const selectAuditHistoryEvents = createSelector(
  selectAuditHistoryModule,
  selectCurrentPageAuditHistoryEvents,
  (state: IAuditHistoryState, auditEvents: IAuditEvent[]) =>
    transformUnitPropertyStructure(auditEvents, state.fieldsMap),
);

export const selectIsLoading = createSelector(
  selectAuditHistoryModule,
  (state: IAuditHistoryState) => state.isLoading,
);

export const selectIsOpened = createSelector(
  selectAuditHistoryModule,
  (state: IAuditHistoryState) => state.isOpened,
);

export const selectOffset = createSelector(
  selectAuditHistoryModule,
  (state: IAuditHistoryState) => state.offset,
);

export const selectHasMoreItems = createSelector(
  selectAuditHistoryModule,
  (state: IAuditHistoryState) => state.hasMoreItems,
);

export const selectEntityInfo = createSelector(
  selectAuditHistoryModule,
  (state: IAuditHistoryState) => ({
    entityId: state.entityId,
    entityType: state.entityType,
    fieldsMap: state.fieldsMap,
  }),
);
