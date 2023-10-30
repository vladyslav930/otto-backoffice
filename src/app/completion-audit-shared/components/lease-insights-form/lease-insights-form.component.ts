import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { myndOttoAppPrefix } from '@myndmanagement/common-otto';

import { ILeaseIncompleteFields } from '../../interfaces/completeness.interface';

@Component({
  selector: 'lease-insights-form',
  templateUrl: './lease-insights-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LeaseInsightsFormComponent {
  readonly myndOttoAppPrefix = myndOttoAppPrefix;

  @Input() leasesCompletionAudit: ILeaseIncompleteFields[];
}
