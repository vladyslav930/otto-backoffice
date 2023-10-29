import { IMyndPagination } from '@myndmanagement/common';
import { createAction, props } from '@ngrx/store';

import { AuditHistoryEntityType } from '../../constants/audit-history-entity-type.constant';
import { IAuditEvent } from '../../interfaces/audit-history.interface';

export const loadAuditHistoryAction = createAction(
  '[Audit History] Load Audit History',
  props<{ pagination: IMyndPagination }>(),
);

export const loadAuditHistoryCompletedAction = createAction(
  '[Audit History] Load Audit History Completed',
  props<{ auditEvents: IAuditEvent[], allItemsLoaded?: boolean }>(),
);

export const loadAuditHistoryFailedAction = createAction(
  '[Audit History] Load Audit History Failed',
);

export const openAuditHistoryModalAction = createAction(
  '[Audit History] Open Audit History Modal',
  props<{ entityId: string; entityType: AuditHistoryEntityType; fieldsMap: { [key: string]: string }; }>(),
);

export const closeAuditHistoryModalAction = createAction(
  '[Audit History] Close Audit History Modal',
);
