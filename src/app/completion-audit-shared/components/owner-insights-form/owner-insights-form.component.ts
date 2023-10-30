import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { myndOttoAppPrefix } from '@myndmanagement/common-otto';

import { IOwnerIncompleteFields } from '../../interfaces/completeness.interface';

@Component({
  selector: 'owner-insights-form',
  templateUrl: './owner-insights-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OwnerInsightsFormComponent {
  readonly myndOttoAppPrefix = myndOttoAppPrefix;

  @Input() ownerCompletionAudit: IOwnerIncompleteFields;
}
