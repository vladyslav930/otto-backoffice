import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';

import { auditHistoryPageLimit } from '../../interfaces/audit-history-params.interface';
import { AuditHistoryService } from '../../services/audit-history.service';
import * as fromActions from '../actions/audit-history.actions';
import { IAuditHistorySlice } from '../reducers/audit-history.reducer';
import { selectEntityInfo, selectHasMoreItems } from '../selectors/audit-history.selectors';

@Injectable()
export class AuditHistoryEffects {
  loadAuditHistory$ = createEffect(() => this.actions$.pipe(
    ofType(fromActions.loadAuditHistoryAction),
    withLatestFrom(this.store.select(selectEntityInfo)),
    withLatestFrom(this.store.select(selectHasMoreItems)),
    switchMap(([[, { entityId, entityType, fieldsMap }], hasMoreItems]) => {
      if (!hasMoreItems) {
        return of(fromActions.loadAuditHistoryCompletedAction({ auditEvents: [] }));
      }

      return this.auditHistoryService.getAuditHistory(entityId, entityType).pipe(
        map(auditEvents => fromActions.loadAuditHistoryCompletedAction({
          auditEvents,
        })),
      );
    }),
    catchError(() => of(fromActions.loadAuditHistoryFailedAction())),
  ));

  openAuditHistoryModal$ = createEffect(() => this.actions$.pipe(
    ofType(fromActions.openAuditHistoryModalAction),
    map(() => fromActions.loadAuditHistoryAction({
      pagination: {
        limit: auditHistoryPageLimit,
        offset: 0,
      },
    })),
  ));

  constructor(
    private actions$: Actions,
    private store: Store<IAuditHistorySlice>,
    private auditHistoryService: AuditHistoryService,
  ) { }
}
