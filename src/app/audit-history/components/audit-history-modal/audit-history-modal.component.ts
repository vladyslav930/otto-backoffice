import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { IMyndPagination, MyndUnsubscriber } from '@myndmanagement/common';
import { IMyndHistoryRecord } from '@myndmanagement/history';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { auditHistoryPageLimit } from '../../interfaces/audit-history-params.interface';
import { loadAuditHistoryAction } from '../../store/actions/audit-history.actions';
import { IAuditHistorySlice } from '../../store/reducers/audit-history.reducer';
import {
  selectAuditHistoryEvents,
  selectHasMoreItems,
  selectIsLoading,
  selectIsOpened,
  selectOffset,
  selectTotalAuditEventsCount,
} from '../../store/selectors/audit-history.selectors';

@Component({
  selector: 'audit-history-modal',
  templateUrl: './audit-history-modal.component.html',
  styleUrls: ['./audit-history-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuditHistoryModalComponent extends MyndUnsubscriber {
  @Output()
  close = new EventEmitter();

  isOpened$: Observable<boolean> = this.store.select(selectIsOpened);
  isLoading$: Observable<boolean> = this.store.select(selectIsLoading);
  hasMoreItems$: Observable<boolean> = this.store.select(selectHasMoreItems);
  offset$: Observable<number> = this.store.select(selectOffset);
  totalCount$: Observable<number> = this.store.select(selectTotalAuditEventsCount);
  auditEvents$: Observable<IMyndHistoryRecord[]> = this.store.select(selectAuditHistoryEvents);

  readonly limit = auditHistoryPageLimit;

  constructor(private store: Store<IAuditHistorySlice>) {
    super();
  }

  handlePaginate(pagination: IMyndPagination): void {
    this.store.dispatch(loadAuditHistoryAction({ pagination }));
  }
}
