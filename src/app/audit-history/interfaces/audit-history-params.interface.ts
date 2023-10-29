import { AuditHistoryEntityType } from '../constants/audit-history-entity-type.constant';

export interface IAuditHistoryParams {
  entityId: string;
  entityType: AuditHistoryEntityType;
  includeFields?: string[];
}

export const auditHistoryPageLimit = 5;
