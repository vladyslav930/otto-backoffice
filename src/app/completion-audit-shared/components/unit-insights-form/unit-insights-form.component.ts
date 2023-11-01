import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IMyndSimpleChanges, myndFilterTruthy, myndTakeFirstUntil } from '@myndmanagement/common';
import { myndOttoAppPrefix } from '@myndmanagement/common-otto';
import { IMyndOption } from '@myndmanagement/forms';
import { MyndModalDialogService } from '@myndmanagement/modals';
import {
  IMyndUnitListItem,
  MyndAccessType,
  MyndUnitSmartLockProvider,
  MyndUnitSmartLockType,
} from '@myndmanagement/services-otto';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Observable, combineLatest, merge } from 'rxjs';
import { filter, map, takeUntil } from 'rxjs/operators';

import { showErrorToast } from '../../../root/store/actions/toastr.action';
import { AccessTypeChangeValidatorClass } from '../../../shared/component-classes/access-type-change-validator.class';
import {
  IEditableGridConfig,
  IEditableGridSectionConfig,
} from '../../../shared/interfaces/editable-grid/editable-grid-config.interface';
import { markFormControlsAsDirty } from '../../../shared/utils/form-group-fns';
import { floorCoveringTypesOptions } from '../../../units-shared/constants/amenities.constant';
import { IUnit } from '../../../units-shared/interfaces/unit.interface';
import { UnitFormBuilderService } from '../../../units-shared/services/unit-form-builder.service';
import {
  getAvailableIglooSerialsAction,
  updateUnitDetails,
} from '../../../units-shared/store/actions/units-details.actions';
import {
  selectAvailableIglooSerialsOptions,
  selectUnitsDetailsEntities,
} from '../../../units-shared/store/selectors/units-details.selectors';
import { selectUnitsList } from '../../../units-shared/store/selectors/units-list.selectors';
import { canCreateLease } from '../../../units-shared/utils/can-create-lease.utils';
import {
  setUpdatesOnFlatFeeChange,
  setUpdatesOnRubsChange,
} from '../../../units-shared/utils/toggle-unit-utilities-payments.utils';
import { setAccessTypeConditionalValidators } from '../../../units-shared/utils/unit-form-validators.utils';
import { responsibilities } from '../../../units/constants/responsibilities.constant';
import { unitIncompleteFieldsMap } from '../../constants/incomplete-fields-map.constant';
import { IUnitIncompleteField } from '../../interfaces/completeness.interface';
import { CompletionStoreType } from '../../store/reducers';

import { UnitInsightsGridConfigService } from './unit-insights-grid-config.service';

@Component({
  selector: 'unit-insights-form',
  templateUrl: './unit-insights-form.component.html',
  styleUrls: ['./unit-insights-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UnitInsightsFormComponent extends AccessTypeChangeValidatorClass implements OnInit, OnChanges {
  readonly unitId$ = new BehaviorSubject<string>(undefined);
  unit$ = combineLatest([
    this.store.select(selectUnitsDetailsEntities),
    this.unitId$,
  ]).pipe(
    filter(([unitsEntities, unitId]) => Boolean(unitsEntities) && Boolean(unitId)),
    map(([unitsEntities, unitId]) => unitsEntities[unitId]),
    myndFilterTruthy(),
  );
  unitsList$: Observable<IMyndUnitListItem[]> = this.store.select(selectUnitsList);
  gridConfig: IEditableGridConfig;
  readonly form: FormGroup = this.getFormGroup();
  readonly missedFields: Set<string> = new Set();
  readonly unitFormControl = this.formBuilder.control([]);
  readonly myndOttoAppPrefix = myndOttoAppPrefix;
  readonly canCreateLease = canCreateLease;
  onboardLeaseSidePanelVisible = false;

  responsibilityOptions$: BehaviorSubject<IMyndOption[]> = new BehaviorSubject(responsibilities);
  availableIglooSerials$: Observable<IMyndOption[]>;
  isEditing$: BehaviorSubject<boolean> = new BehaviorSubject(null);
  unitsCompletionAudit$: BehaviorSubject<IUnitIncompleteField[]> = new BehaviorSubject(null);

  @Input() set isEditing(isEditing: boolean) {
    this.isEditing$.next(isEditing);
  }
  @Input() unitsCompletionAudit: IUnitIncompleteField[];

  @Input() set unitId(id: string) {
    this.unitId$.next(id);
  }

  get isEditing(): boolean {
    return this.isEditing$.getValue();
  }

  constructor(
    private store: Store<CompletionStoreType>,
    private formBuilder: FormBuilder,
    private changeDetectionRef: ChangeDetectorRef,
    private unitInsightsGridConfigService: UnitInsightsGridConfigService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private unitFormBuilder: UnitFormBuilderService,
    public modalDialog: MyndModalDialogService,
    public cdr: ChangeDetectorRef,
  ) {
    super(modalDialog, cdr);
  }

  ngOnInit(): void {
    super.ngOnInit();

    this.updateSelectedUnit();
    this.updateDataOnUnitIdChange();
    this.selectFirstUnit();

    this.updateFormOnUnitChange();
    this.updateGridConfig();

    this.setUpdatesOnPaymentTypeToggle();

    this.getAvailableIglooSerials();
    this.warnOnAccessTypeChange();
  }

  ngOnChanges(changes: IMyndSimpleChanges<UnitInsightsFormComponent>): void {
    if (changes.unitsCompletionAudit) {
      this.unitsCompletionAudit$.next(changes.unitsCompletionAudit.currentValue);
    }
  }

  isIgloo(provider: MyndUnitSmartLockProvider, type: MyndUnitSmartLockType, accessType: MyndAccessType): boolean {
    return accessType === MyndAccessType.SmartLock
      && provider === MyndUnitSmartLockProvider.Igloo
      && (type === MyndUnitSmartLockType.IglooSmartLock || type === MyndUnitSmartLockType.IglooKeybox);
  }

  unitSelected(unitId: string): void {
    this.router.navigate(['.'], {
      relativeTo: this.activatedRoute,
      queryParams: { unit: unitId },
    });
  }

  save(): void {
    markFormControlsAsDirty(this.form, { dirty: true, touched: true });

    if (this.form.invalid) {
      this.store.dispatch(showErrorToast({
        message: 'Please fix all form errors',
      }));
      return;
    }

    const updateModel = this.formToUpdateModel();

    this.store.dispatch(updateUnitDetails({
      data: updateModel,
    }));
  }

  getAvailableIglooSerials(): void {
    combineLatest([
      this.form.get('access.smartLock.provider').valueChanges,
      this.form.get('access.smartLock.type').valueChanges,
      this.form.get('access.accessType').valueChanges,
    ]).pipe(
      filter(([provider, type, accessType]) => {
        return this.isIgloo(provider, type, accessType) && this.isEditing;
      }),
      takeUntil(this.unsubscribe),
    ).subscribe(() => this.store.dispatch(getAvailableIglooSerialsAction({ unitId: this.unitId$.getValue() })));
  }

  openOnboardLeaseSidePanel(): void {
    this.onboardLeaseSidePanelVisible = true;
  }

  closeOnboardLeaseSidePanel(): void {
    this.onboardLeaseSidePanelVisible = false;
  }

  private updateSelectedUnit(): void {
    this.unitFormControl.valueChanges.pipe(
      takeUntil(this.unsubscribe),
    ).subscribe(unitId => this.unitSelected(unitId));
  }

  private updateDataOnUnitIdChange(): void {
    this.unitId$.pipe(
      takeUntil(this.unsubscribe),
    ).subscribe((unitId) => {
      this.unitFormControl.patchValue(unitId, { emitEvent: false });
      this.availableIglooSerials$ = this.store.select(selectAvailableIglooSerialsOptions, unitId);
    });
  }

  private selectFirstUnit(): void {
    this.unitsList$.pipe(
      myndTakeFirstUntil(this.unsubscribe, unitsList => Boolean(unitsList.length)),
    ).subscribe((unitsList) => {
      const selectedUnitId = this.activatedRoute.snapshot.queryParams['unit'];

      if (!selectedUnitId) {
        this.unitSelected(unitsList[0].unitId);
      }
    });
  }

  private updateGridConfig(): void {
    combineLatest([
      this.unit$.pipe(filter(unit => Boolean(unit))),
      this.responsibilityOptions$,
      this.availableIglooSerials$,
      this.isEditing$,
      this.unitsCompletionAudit$,
    ]).pipe(
      takeUntil(this.unsubscribe),
    ).subscribe(([unit, responsibilityOptions, availableSerials]) => {
      this.gridConfig = this.getGridConfig(
        unit,
        availableSerials,
        responsibilityOptions,
      );

      this.changeDetectionRef.markForCheck();
    });
  }

  private updateFormOnUnitChange(): void {
    combineLatest([this.unit$, this.isEditing$]).pipe(
      takeUntil(this.unsubscribe),
    ).subscribe(([unit]) => {
      this.patchForm(unit);
    });
  }

  private setUpdatesOnPaymentTypeToggle(): void {
    merge(
      setUpdatesOnRubsChange(this.form),
      setUpdatesOnFlatFeeChange(this.form),
    ).pipe(
      takeUntil(this.unsubscribe),
    ).subscribe(this.responsibilityOptions$);
  }

  private formToUpdateModel(): IUnit {
    const rawValue = this.form.getRawValue();

    return {
      ...rawValue,
      amenities: {
        ...rawValue.amenities,
        floorCoverings: rawValue.amenities.floorCoverings.map(item => item.key),
      },
    };
  }

  private getGridConfig(
    unit: IUnit,
    availableSerials: IMyndOption[],
    responsibilityOptions: IMyndOption[],
  ): IEditableGridConfig {
    this.missedFields.clear();
    const gridConfig = this.unitInsightsGridConfigService.buildGridConfig(
      unit,
      availableSerials,
      responsibilityOptions,
      this.form,
      this.changeDetectionRef,
    );

    return {
      ...gridConfig,
      sections: gridConfig.sections.map((section) => {
        return this.filterByIncompleteFields(section, unit.details.unitId);
      }).filter(section => section.items.length),
    };
  }

  private filterByIncompleteFields(
    section: IEditableGridSectionConfig,
    unitId: string,
  ): IEditableGridSectionConfig {
    if (!this.unitsCompletionAudit) {
      return section;
    }

    const unitCompletionAudit = this.unitsCompletionAudit.find(audit => audit.unitId === unitId);
    const incompleteFields = unitCompletionAudit?.incompleteFields;

    if (!incompleteFields) {
      return {
        ...section,
        items: [],
      };
    }

    return {
      ...section,
      items: section.items.filter((item) => {
        return incompleteFields.some((incompleteField) => {
          const fieldPath: string = unitIncompleteFieldsMap[incompleteField];

          if (!fieldPath) {
            this.missedFields.add(incompleteField);
            return false;
          }

          const itemFieldsPath = item.formPath
            ? [item.formPath, item.key].join('.')
            : item.key;

          return fieldPath === itemFieldsPath;
        });
      }),
    };
  }

  private getFormGroup(): FormGroup {
    const form = this.formBuilder.group({
      details: this.unitFormBuilder.getUnitDetailsForm(false),
      parking: this.unitFormBuilder.getUnitParkingForm(false),
      amenities: this.unitFormBuilder.getUnitAmenitiesForm(false),
      access: this.unitFormBuilder.getUnitAccessForm(false),
      rentalDetails: this.unitFormBuilder.getUnitRentalDetailsForm(false),
      utilities: this.unitFormBuilder.getUnitUtilitiesForm(),
    });

    setAccessTypeConditionalValidators(form);

    return form;
  }

  private patchForm(unit: IUnit): void {
    const floorCoverings: IMyndOption[] = unit.amenities.floorCoverings
      .map(value => floorCoveringTypesOptions.find(item => item.key === value));

    this.form.patchValue({
      ...unit,
      parking: {
        ...unit.parking,
        parentUnitId: unit.parking.parentUnit?.unitId ?? null,
      },
      amenities: {
        ...unit.amenities,
        floorCoverings,
      },
      utilities: {
        ...unit.utilities,
        notes: unit.utilities.notes || '',
      },
    });
  }
}
