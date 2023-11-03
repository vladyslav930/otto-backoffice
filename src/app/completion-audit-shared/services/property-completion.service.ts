import { Injectable } from '@angular/core';
import { MyndHttpService } from '@myndmanagement/common';
import { Observable } from 'rxjs';

import { IIncompleteFields } from '../interfaces/completeness.interface';

const endpoint = 'v2/owner-onboarding/onboarding-insights/property';

@Injectable()
export class PropertyCompletionService extends MyndHttpService {
  getIncompleteFields(propertyId: string): Observable<IIncompleteFields> {
    return this.get(`${endpoint}/${propertyId}/incomplete-fields`);
  }

  getCompleteness(propertyId: string): Observable<{ completeness: string }> {
    return this.get(`${endpoint}/${propertyId}/completeness`);
  }

  getInstitutionalIncompleteFields(propertyId: string): Observable<IIncompleteFields> {
    return this.get(`${endpoint}/${propertyId}/institutional-incomplete-fields`);
  }

  getInstitutionalCompleteness(propertyId: string): Observable<{ completeness: string }> {
    return this.get(`${endpoint}/${propertyId}/institutional-completeness`);
  }
}
