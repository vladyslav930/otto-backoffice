import { Injectable } from '@angular/core';
import { MyndUnsubscriber } from '@myndmanagement/common';
import { MyndModalDialogRef, MyndModalDialogService } from '@myndmanagement/modals';
import { Store } from '@ngrx/store';
import { takeUntil } from 'rxjs/operators';

import { AuditHistoryModalComponent } from '../components/audit-history-modal/audit-history-modal.component';
import { AuditHistoryEntityType } from '../constants/audit-history-entity-type.constant';
import { closeAuditHistoryModalAction, openAuditHistoryModalAction } from '../store/actions/audit-history.actions';
import { IAuditHistorySlice } from '../store/reducers/audit-history.reducer';

@Injectable()
export class AuditHistoryModalService extends MyndUnsubscriber {
  private modalDialogRef: MyndModalDialogRef<AuditHistoryModalComponent>;

  constructor(
    private store: Store<IAuditHistorySlice>,
    private myndModalDialogService: MyndModalDialogService,
  ) {
    super();
  }

  open(targetId: string, targetType: AuditHistoryEntityType, fieldsMap?: { [key: string]: string }): void {
    this.store.dispatch(openAuditHistoryModalAction({
      fieldsMap,
      entityId: targetId,
      entityType: targetType,
    }));

    this.modalDialogRef = this.myndModalDialogService.open(AuditHistoryModalComponent, {
      panelClass: ['audit-history-modal'],
      maxWidth: '100%',
    });

    this.modalDialogRef.componentInstance.close.pipe(
      takeUntil(this.unsubscribe),
    ).subscribe(() => {
      this.close();
    });

    this.modalDialogRef.afterClosed().subscribe(() => {
      this.store.dispatch(closeAuditHistoryModalAction());
    });
  }

  close(): void {
    this.modalDialogRef?.close();
  }
}
