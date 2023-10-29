import { EntityAdapter, EntityState, createEntityAdapter } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';

import { AuditHistoryEntityType } from '../../constants/audit-history-entity-type.constant';
import { auditHistoryPageLimit } from '../../interfaces/audit-history-params.interface';
import { IAuditEvent } from '../../interfaces/audit-history.interface';
import { transformAuditTypeToFieldName } from '../../utils/action-history-transform-fns';
import * as fromActions from '../actions/audit-history.actions';

export interface IAuditHistoryState extends EntityState<IAuditEvent> {
  isLoading: boolean;
  isOpened: boolean;
  offset: number;
  hasMoreItems: boolean;
  entityId: string;
  entityType: AuditHistoryEntityType;
  fieldsMap: { [key: string]: string };
}

export const auditHistoryAdapter: EntityAdapter<IAuditEvent> = createEntityAdapter<IAuditEvent>({
  selectId: (auditEvent: IAuditEvent): string => [auditEvent.type, auditEvent.updatedAt].join('_'),
});

export const initialState: IAuditHistoryState = auditHistoryAdapter.getInitialState({
  isLoading: false,
  isOpened: false,
  offset: 0,
  hasMoreItems: true,
  entityId: undefined,
  entityType: undefined,
  fieldsMap: {},
});

export const auditHistoryStateKey = 'auditHistory';

export interface IAuditHistorySlice {
  [auditHistoryStateKey]: IAuditHistoryState;
}

// aot compiler wrapper
export function auditHistoryReducer(state: IAuditHistoryState | undefined, action: Action): IAuditHistoryState {
  return reducer(state, action);
}

const reducer = createReducer<IAuditHistoryState>(
  initialState,

  on(fromActions.loadAuditHistoryAction, (state, { pagination: { offset } }) => ({
    ...state,
    offset,
    isLoading: true,
  })),
  on(fromActions.loadAuditHistoryCompletedAction, (state, { auditEvents, allItemsLoaded }) => {
    const filteredFieldsSet = new Set(Object.keys(state.fieldsMap || {}));
    const filteredAuditEvents = filteredFieldsSet.size > 0
      ? auditEvents.filter(event => filteredFieldsSet.has(transformAuditTypeToFieldName(event.type)))
      : auditEvents;

    return auditHistoryAdapter.upsertMany(filteredAuditEvents, {
      ...state,
      hasMoreItems: allItemsLoaded ? false : filteredAuditEvents.length > auditHistoryPageLimit,
      isLoading: false,
    });
  }),
  on(fromActions.loadAuditHistoryFailedAction, state => ({
    ...state,
    isLoading: false,
  })),

  on(fromActions.openAuditHistoryModalAction, (state, { entityId, entityType, fieldsMap }) => ({
    ...state,
    entityId,
    entityType,
    fieldsMap,
    isOpened: true,
  })),
  on(fromActions.closeAuditHistoryModalAction, () => auditHistoryAdapter.removeAll({
    ...initialState,
  })),
);
