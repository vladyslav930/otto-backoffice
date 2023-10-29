import { Injectable } from '@angular/core';
import { MyndHttpService } from '@myndmanagement/common';
import { Observable, throwError } from 'rxjs';

import { AuditHistoryEntityType } from '../constants/audit-history-entity-type.constant';
import { IAuditEvent } from '../interfaces/audit-history.interface';

const propertiesApiPrefix = 'v2/properties';

@Injectable()
export class AuditHistoryService extends MyndHttpService {
  getAuditHistory(entityId: string, entityType: AuditHistoryEntityType): Observable<IAuditEvent[]> {
    switch (entityType) {
      case AuditHistoryEntityType.Property:
        return this.getPropertyAuditHistory(entityId);
      case AuditHistoryEntityType.Unit:
        return this.getUnitAuditHistory(entityId);
      case AuditHistoryEntityType.Opportunity:
        return this.getOpportunityAuditHistory(entityId);
      case AuditHistoryEntityType.Onboarding:
        return this.getOnboardingAuditHistory(entityId);
      default:
        return throwError(`Unsupported audit type: ${entityType}`);
    }
  }

  getUnitAuditHistory(unitId: string): Observable<IAuditEvent[]> {
    return super.get(`${propertiesApiPrefix}/units/${unitId}/audit`);
  }

  getPropertyAuditHistory(propertyId: string): Observable<IAuditEvent[]> {
    return super.get(`${propertiesApiPrefix}/properties/${propertyId}/audit`);
  }

  getOpportunityAuditHistory(opportunityId: string): Observable<IAuditEvent[]> {
    return super.get(`v2/owner-onboarding/opportunities/${opportunityId}/audit`);
  }

  getOnboardingAuditHistory(onboardingId: string): Observable<IAuditEvent[]> {
    return super.get(`v2/owner-onboarding/onboarding/${onboardingId}/audit`);
  }
}
