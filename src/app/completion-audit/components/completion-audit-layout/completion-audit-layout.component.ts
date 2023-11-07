import { ChangeDetectionStrategy, Component, EventEmitter, OnInit } from '@angular/core';
import { MyndUnsubscriber } from '@myndmanagement/common';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { takeUntil, withLatestFrom } from 'rxjs/operators';

import {
  startEditing,
  stopEditing,
  updateInstitutionalIncompleteFields,
} from '../../../completion-audit-shared/store/actions/completion.actions';
import { CompletionStoreType } from '../../../completion-audit-shared/store/reducers';
import {
  selectInstitutionalCompleteness,
  selectInstitutionalIncompleteFields,
  selectIsEditing,
  selectIsInstitutionalIncompleteFieldsBusy,
  selectSelectedUnitId,
} from '../../../completion-audit-shared/store/selectors/completion.selectors';
import { updatePropertyAccessCompleted } from '../../../property-shared/store/actions/property-access.actions';
import { updatePropertyAmenitiesCompleted } from '../../../property-shared/store/actions/property-amenities.actions';
import { updatePropertyDetailsCompleted } from '../../../property-shared/store/actions/property-details.actions';
import { updatePropertyHoaCompleted } from '../../../property-shared/store/actions/property-hoa.actions';
import { updateUtilitiesDetailsCompleted } from '../../../property-shared/store/actions/property-utilities.actions';
import { selectPropertyDetails } from '../../../property-shared/store/selectors/property-details.selectors';
import { updateUnitDetailsCompleted } from '../../../units-shared/store/actions/units-details.actions';

@Component({
  selector: 'completion-audit-layout',
  templateUrl: './completion-audit-layout.component.html',
  styleUrls: ['./completion-audit-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompletionAuditComponent extends MyndUnsubscriber implements OnInit {
  readonly propertyDetails$ = this.store.select(selectPropertyDetails);
  readonly completeness$ = this.store.select(selectInstitutionalCompleteness);

  readonly incompleteFields$ = this.store.select(selectInstitutionalIncompleteFields);
  readonly isEditing$ = this.store.select(selectIsEditing);
  readonly isLoading$ = this.store.select(selectIsInstitutionalIncompleteFieldsBusy);
  readonly unitId$ = this.store.select(selectSelectedUnitId);

  readonly saveTrigger = new EventEmitter();

  constructor(
    private store: Store<CompletionStoreType>,
    private actions$: Actions,
  ) {
    super();
  }

  ngOnInit(): void {
    this.actions$.pipe(
      ofType(
        updatePropertyDetailsCompleted,
        updatePropertyHoaCompleted,
        updatePropertyAmenitiesCompleted,
        updatePropertyAccessCompleted,
        updateUtilitiesDetailsCompleted,
        updateUnitDetailsCompleted,
      ),
      withLatestFrom(this.propertyDetails$),
      takeUntil(this.unsubscribe),
    ).subscribe(([, { propertyId }]) => this.store.dispatch(updateInstitutionalIncompleteFields({ propertyId })));
  }

  onEdit(): void {
    this.store.dispatch(startEditing());
  }

  onCancel(): void {
    this.store.dispatch(stopEditing());
  }

  onSave(): void {
    this.saveTrigger.emit();
  }
}
