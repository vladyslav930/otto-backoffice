import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IMyndPagination, MyndUnsubscriber, myndTakeFirstUntil } from '@myndmanagement/common';
import { IMyndWizardStep } from '@myndmanagement/layout';
import { IMyndTable, IMyndTableColumn, IMyndTableColumnConfig, IMyndTableRow } from '@myndmanagement/table';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { IAppState, storeSelect } from '../../../root/store/reducers';
import { markFormControlsAsDirty } from '../../../shared/utils/form-group-fns';
import { IEntityTaxInfo } from '../../interfaces/entity-tax-info.interface';
import * as fromActions from '../../store/actions/accounting.actions';
import {
  selectEntitiesUpdate,
  selectGApiInitialization,
  selectSheet,
} from '../../store/selectors/accounting.selectors';
import { extractSheetIdFromDocUrl, sheetUrlValidator } from '../../utils/sheets-url.validator';

@Component({
  selector: 'accounting-import',
  templateUrl: './accounting-import.component.html',
  styleUrls: ['./accounting-import.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountingImportComponent extends MyndUnsubscriber implements OnInit {
  initialization$: Observable<boolean> = storeSelect(selectGApiInitialization);
  sheet$: Observable<{ loading: boolean; isValid: boolean; data: IEntityTaxInfo[] }> = storeSelect(selectSheet);
  entitiesUpdate$: Observable<{ completed: boolean; failed: boolean; loading: boolean; }>
    = storeSelect(selectEntitiesUpdate);

  showSpreadsheetDetails = false;
  limit = 10;
  offset = 0;

  steps: IMyndWizardStep[] = [
    {
      key: 'spreadsheet',
      name: 'Spreadsheet info',
      canActivate: () => true,
    },
    {
      key: 'preview',
      name: 'Preview',
      canActivate: () => Boolean(this.originalData && this.originalData.length),
    },
    {
      key: 'import',
      name: 'Import',
      canActivate: () => false,
    },
  ];

  currentStep = 0;
  sheetForm: FormGroup;
  originalData: IEntityTaxInfo[] = [];
  paginatedRows: IEntityTaxInfo[] = [];
  tableConfig: IMyndTable;

  constructor(
    private cdr: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private store: Store<IAppState>,
  ) {
    super();
  }

  ngOnInit(): void {
    this.sheetForm = this.formBuilder.group({
      url: [null, [Validators.required, sheetUrlValidator]],
      sheet: [null, Validators.required],
    });

    this.sheet$.pipe(takeUntil(this.unsubscribe))
      .subscribe((sheet) => {
        if (sheet && sheet.isValid && sheet.data) {
          this.originalData = sheet.data;
          this.currentStep = 1;
          this.cancelSheetDetailsForm();

          this.paginatedRows = this.getPaginatedRows();
          this.createTable();
          this.cdr.markForCheck();
        }
      });

    this.entitiesUpdate$.pipe(takeUntil(this.unsubscribe))
      .subscribe((updating) => {
        if (!updating.loading && updating.completed) {
          this.currentStep = 2;
          this.cdr.markForCheck();
        }
      });
  }

  loadData(): void {
    markFormControlsAsDirty(this.sheetForm);

    if (this.sheetForm.valid) {
      const sheetUrl = this.sheetForm.get('url').value;
      const range = this.sheetForm.get('sheet').value;
      const sheetId = extractSheetIdFromDocUrl(sheetUrl);

      this.store.dispatch(fromActions.loadEntityAccountingDocAction({
        sheetId,
        range,
      }));
    }
  }

  importData(): void {
    this.sheet$
      .pipe(myndTakeFirstUntil(this.unsubscribe))
      .subscribe((sheet) => {
        if (sheet && sheet.isValid && sheet.data) {
          const payload = sheet.data.reduce((acc, item) => {
            const result = {
              ...acc,
            };
            result[item.businessLegalName] = {
              einTaxId: item.einTaxId,
              encryptedForeignTaxId: item.encryptedForeignTaxId,
              encryptedSsnTaxId: item.encryptedSsnTaxId,
              maskedForeignTaxId: item.maskedForeignTaxId,
              maskedSsnTaxId: item.maskedSsnTaxId,
              taxIdType: item.taxIdType,
            };

            return result;
          }, {});
          this.store.dispatch(fromActions.updateBatchEntityTaxIdInfoAction({
            payload: {
              legalNameToEntityTaxIdInfo: payload,
            },
          }));
        }
      });
  }

  openSpreadsheetDetailsModal(): void {
    this.showSpreadsheetDetails = true;
  }

  cancelSheetDetailsForm(): void {
    this.showSpreadsheetDetails = false;
  }

  switchToStep($event: { index: number; step: IMyndWizardStep }): void {
    this.currentStep = $event.index;
  }

  paginate(paginationParams: IMyndPagination): void {
    this.limit = paginationParams.limit;
    this.offset = paginationParams.offset;

    this.paginatedRows = this.getPaginatedRows();
    this.createTable();
  }

  private createTable(): void {
    const tableColumns: IMyndTableColumnConfig[] = [
      {
        headerTitle: '#',
        valueFn: (row: IEntityTaxInfo) => row.rowNumber,
      },
      {
        headerTitle: 'Business legal name',
        valueFn: (row: IEntityTaxInfo) => row.businessLegalName,
      },
      {
        headerTitle: 'Tax Id type',
        valueFn: (row: IEntityTaxInfo) => row.taxIdType,
      },
      {
        headerTitle: 'Tax Id',
        valueFn: (row: IEntityTaxInfo) => row.einTaxId || row.maskedSsnTaxId || row.maskedForeignTaxId,
      },
    ];

    const headerRow: IMyndTableRow = {
      columns: tableColumns.map((config) => {
        return {
          value: config.headerTitle,
          onClick: config.sortFn as () => void,
          key: config.headerKey,
        };
      }),
      isHeader: true,
    };
    const rows: IMyndTableRow[] = this.paginatedRows
      .map((row: IEntityTaxInfo) => {
        return {
          columns: tableColumns.map((config): IMyndTableColumn => {
            return {
              value: config.valueFn(row),
            };
          }),
        };
      });

    this.tableConfig = {
      rows: [headerRow, ...rows],
      theme: 'standard',
      isFullWidth: true,
    };
  }

  private getPaginatedRows(): IEntityTaxInfo[] {
    const rows: IEntityTaxInfo[] = this.originalData || [];
    return rows.concat().splice(this.offset, this.limit);
  }
}
