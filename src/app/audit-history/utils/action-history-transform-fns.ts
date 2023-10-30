import { IMyndHistoryRecord } from '@myndmanagement/history';
import { camelCase } from 'lodash';

import { IAuditEvent } from '../interfaces/audit-history.interface';

export const transformUnitPropertyStructure = (
  rawData: IAuditEvent[],
  fieldsMap: { [key: string]: string } = {},
): IMyndHistoryRecord[] => (rawData || []).reduce((acc, change) => {
  const transformedFieldName = transformAuditTypeToFieldName(change.type);
  const fieldName = fieldsMap[change.type] || fieldsMap[transformedFieldName] || transformedFieldName;

  if (
    change.oldValue === null
    && change.newValue === null
    || fieldName === 'updatedAt'
    || fieldName === 'timeZone'
  ) {
    return acc;
  }

  return [
    ...acc,
    {
      who: change.updatedBy,
      when: new Date(change.updatedAt),
      what: {
        fieldName,
        objectId: null,
        objectType: null,
        objectTitle: '',
        newValue: change.newValue,
        oldValue: change.oldValue,
        revisionType: change.revisionType,
      },
    }];
}, []);

/*
  'UNIT_SECURITY_DEPOSIT_TYPE' -> 'securityDepositType'
  'PROPERTY_MANAGED_SINCE_DATE' -> 'managedSinceDate'
*/
export function transformAuditTypeToFieldName(type: string): string {
  return camelCase(type.substr(type.indexOf('_') + 1));
}
