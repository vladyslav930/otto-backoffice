import { Injectable } from '@angular/core';
import { MyndToastrService } from '@myndmanagement/toast';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { debounceTime, map, switchMap } from 'rxjs/operators';

import { PropertyCompletionService } from '../../services/property-completion.service';
import {
  getCompleteness,
  getCompletenessCompleted,
  getCompletenessFailed,
  getIncompleteFields,
  getIncompleteFieldsCompleted,
  getIncompleteFieldsFailed,
  getInstitutionalCompleteness,
  getInstitutionalCompletenessCompleted,
  getInstitutionalCompletenessFailed,
  getInstitutionalIncompleteFields,
  getInstitutionalIncompleteFieldsCompleted,
  getInstitutionalIncompleteFieldsFailed,
  updateIncompleteFields,
  updateInstitutionalIncompleteFields,
} from '../actions/completion.actions';

@Injectable()
export class CompletionEffects {
  getIncompleteFields$ = createEffect(() => this.actions$.pipe(
    ofType(getIncompleteFields),
    switchMap(({ propertyId }) => {
      return this.propertyCompletionService.getIncompleteFields(propertyId).pipe(
        map(incompleteFields => getIncompleteFieldsCompleted({ incompleteFields })),
        this.myndToastrService.catchServerError(getIncompleteFieldsFailed()),
      );
    }),
  ));

  updateIncompleteFields$ = createEffect(() => this.actions$.pipe(
    ofType(updateIncompleteFields),
    // Note: we have to wait of update of replicated data on BE
    debounceTime(6000),
    switchMap(({ propertyId }) => [
      getIncompleteFields({ propertyId }),
      getCompleteness({ propertyId }),
    ]),
  ));

  getCompleteness$ = createEffect(() => this.actions$.pipe(
    ofType(getCompleteness),
    switchMap(({ propertyId }) => {
      return this.propertyCompletionService
        .getCompleteness(propertyId)
        .pipe(
          map(response => getCompletenessCompleted({ completeness: response.completeness })),
          this.myndToastrService.catchServerError(getCompletenessFailed()),
        );
    }),
  ));

  getInstitutionalIncompleteFields$ = createEffect(() => this.actions$.pipe(
    ofType(getInstitutionalIncompleteFields),
    switchMap(({ propertyId }) => {
      return this.propertyCompletionService.getInstitutionalIncompleteFields(propertyId).pipe(
        map(incompleteFields => getInstitutionalIncompleteFieldsCompleted({ incompleteFields })),
        this.myndToastrService.catchServerError(getInstitutionalIncompleteFieldsFailed()),
      );
    }),
  ));

  updateInstitutionalIncompleteFields$ = createEffect(() => this.actions$.pipe(
    ofType(updateInstitutionalIncompleteFields),
    // Note: we have to wait of update of replicated data on BE
    debounceTime(6000),
    switchMap(({ propertyId }) => [
      getInstitutionalIncompleteFields({ propertyId }),
      getInstitutionalCompleteness({ propertyId }),
    ]),
  ));

  getInstitutionalCompleteness$ = createEffect(() => this.actions$.pipe(
    ofType(getInstitutionalCompleteness),
    switchMap(({ propertyId }) => {
      return this.propertyCompletionService
        .getInstitutionalCompleteness(propertyId)
        .pipe(
          map(response => getInstitutionalCompletenessCompleted({ completeness: response.completeness })),
          this.myndToastrService.catchServerError(getInstitutionalCompletenessFailed()),
        );
    }),
  ));

  constructor(
    private actions$: Actions,
    private propertyCompletionService: PropertyCompletionService,
    private myndToastrService: MyndToastrService,
  ) { }
}
