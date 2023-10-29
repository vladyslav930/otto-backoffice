import { IMyndHistoryRecordWho, MyndRevisionType } from '@myndmanagement/history';

import { AuditHistoryObjectType } from '../constants/audit-history-entity-type.constant';

export interface IAuditEvent {
  objectId: string;
  objectType: AuditHistoryObjectType;
  type: string;
  oldValue: string;
  newValue: string;
  updatedBy: IMyndHistoryRecordWho;
  revisionType: MyndRevisionType;
  updatedAt: string;
}
