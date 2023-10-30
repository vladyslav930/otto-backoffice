import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { myndFilterTruthy } from '@myndmanagement/common';
import { myndOttoAppPrefix } from '@myndmanagement/common-otto';
import { IMyndOption } from '@myndmanagement/forms';
import { myndLoadPropertyAreas, myndSelectAreaListOptions } from '@myndmanagement/properties';
import {
  IMyndPropertyAccessDto,
  IMyndPropertyAmenitiesDto,
  IMyndPropertyDetailsDto,
  IMyndPropertyHoaDto,
  IMyndPropertyOffboardingDto,
  IMyndPropertyUtilitiesDto,
} from '@myndmanagement/services-otto';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { PropertyFormsBuilderService } from '../../../property-shared/services/property-forms-builder.service';
import { updatePropertyAccess } from '../../../property-shared/store/actions/property-access.actions';
import { updatePropertyAmenities } from '../../../property-shared/store/actions/property-amenities.actions';
import { updatePropertyDetails } from '../../../property-shared/store/actions/property-details.actions';
import { updatePropertyHoa } from '../../../property-shared/store/actions/property-hoa.actions';
import { updateUtilitiesDetails } from '../../../property-shared/store/actions/property-utilities.actions';
import { selectPropertyAccess } from '../../../property-shared/store/selectors/property-access.selectors';
import { selectPropertyAmenities } from '../../../property-shared/store/selectors/property-amenities.selectors';
import { selectPropertyDetails } from '../../../property-shared/store/selectors/property-details.selectors';
import { selectPropertyHoa } from '../../../property-shared/store/selectors/property-hoa.selectors';
import { selectPropertyOffboarding } from '../../../property-shared/store/selectors/property-offboarding.selectors';
import { selectPropertyUtilities } from '../../../property-shared/store/selectors/property-utilities.selectors';
import {
  propertyAmenitiesToForm,
  propertyDetailsToForm,
  propertyUtilitiesToForm,
} from '../../../property-shared/utils/property-converters.utils';
import {
  propertyAmenitiesToModel,
  propertyDetailsFormToModel,
  propertyUtilitiesToModel,
} from '../../../property-shared/utils/property-form-converters.utils';
import { showErrorToast } from '../../../root/store/actions/toastr.action';
import { SectionFormGrid } from '../../../shared/component-classes/section-form-grid.class';
import {
  IEditableGridConfig,
  IEditableGridSectionConfig,
} from '../../../shared/interfaces/editable-grid/editable-grid-config.interface';
import { markFormControlsAsDirty } from '../../../shared/utils/form-group-fns';
import { propertyIncompleteFieldsMap } from '../../constants/incomplete-fields-map.constant';
import { CompletionStoreType } from '../../store/reducers';

import { PropertyInsightsGridConfigService } from './property-insights-grid-config.service';

@Component({
  selector: 'property-insights-form',
  templateUrl: './property-insights-form.component.html',
  styleUrls: ['./property-insights-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PropertyInsightsFormComponent extends SectionFormGrid implements OnInit {
  readonly propertyAreaOptions$: Observable<IMyndOption[]> = this.store.select(myndSelectAreaListOptions);

  readonly propertyDetails$ = this.store.select(selectPropertyDetails);
  readonly propertyHoa$ = this.store.select(selectPropertyHoa);
  readonly propertyAmenities$ = this.store.select(selectPropertyAmenities);
  readonly propertyAccess$ = this.store.select(selectPropertyAccess);
  readonly propertyOffboarding$ = this.store.select(selectPropertyOffboarding);
  readonly propertyUtilities$ = this.store.select(selectPropertyUtilities);

  gridConfig: IEditableGridConfig;
  readonly form: FormGroup = this.getFormGroup();

  readonly isEditing$ = new BehaviorSubject(false);
  readonly incompleteFields$ = new BehaviorSubject(undefined);
  readonly missedFields: Set<string> = new Set();
  readonly myndOttoAppPrefix = myndOttoAppPrefix;

  @Input()
  set isEditing(value: boolean) {
    this.isEditing$.next(value);
  }

  @Input()
  set incompleteFields(value: string[]) {
    this.incompleteFields$.next(value);
  }

  constructor(
    private store: Store<CompletionStoreType>,
    private formBuilder: FormBuilder,
    private changeDetectionRef: ChangeDetectorRef,
    private propertyInsightsGridConfigService: PropertyInsightsGridConfigService,
    private propertyFormBuilder: PropertyFormsBuilderService,
  ) {
    super();
  }

  ngOnInit(): void {
    super.ngOnInit();

    this.store.dispatch(myndLoadPropertyAreas());
    this.setupUpdates();
  }

  save(): void {
    markFormControlsAsDirty(this.form, { dirty: true, touched: true });

    if (this.form.invalid) {
      this.store.dispatch(showErrorToast({
        message: 'Please fix all form errors',
      }));
      return;
    }

    this.store.dispatch(updatePropertyDetails({ details: propertyDetailsFormToModel(this.form) }));
    this.store.dispatch(updatePropertyAmenities({ amenities: propertyAmenitiesToModel(this.form) }));
    this.store.dispatch(updatePropertyAccess({ access: this.form.getRawValue().access }));
    this.store.dispatch(updatePropertyHoa({ hoa: this.form.getRawValue().hoa }));
    this.store.dispatch(updateUtilitiesDetails({ utilities: propertyUtilitiesToModel(this.form) }));
  }

  private getGridConfig(
    details: IMyndPropertyDetailsDto,
    hoa: IMyndPropertyHoaDto,
    amenities: IMyndPropertyAmenitiesDto,
    access: IMyndPropertyAccessDto,
    utilities: IMyndPropertyUtilitiesDto,
    offboarding: IMyndPropertyOffboardingDto,
    propertyAreaOptions: IMyndOption[],
    incompleteFields: string[],
    form: FormGroup,
  ): IEditableGridConfig {
    this.missedFields.clear();
    const gridConfig = this.propertyInsightsGridConfigService.buildConfig(
      details,
      hoa,
      amenities,
      access,
      utilities,
      offboarding,
      propertyAreaOptions,
      form,
    );

    return {
      ...gridConfig,
      sections: gridConfig.sections.map((section) => {
        return this.filterByIncompleteFields(section, incompleteFields);
      }).filter(section => section.items.length),
    };
  }

  private filterByIncompleteFields(
    section: IEditableGridSectionConfig,
    incompleteFields: string[],
  ): IEditableGridSectionConfig {
    if (!incompleteFields) {
      return section;
    }

    return {
      ...section,
      items: section.items.filter((item) => {
        return incompleteFields.some((incompleteField) => {
          const fieldPath: string = propertyIncompleteFieldsMap[incompleteField];

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

  private setupUpdates(): void {
    combineLatest([
      this.propertyDetails$.pipe(myndFilterTruthy()),
      this.propertyHoa$.pipe(myndFilterTruthy()),
      this.propertyAmenities$.pipe(myndFilterTruthy()),
      this.propertyAccess$.pipe(myndFilterTruthy()),
      this.propertyUtilities$.pipe(myndFilterTruthy()),
      this.propertyOffboarding$.pipe(myndFilterTruthy()),
      this.propertyAreaOptions$,
      this.incompleteFields$,
      this.isEditing$,
    ])
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(([details, hoa, amenities, access, utilities, offboarding, propertyAreaOptions, incompleteFields]) => {
        this.patchForm(details, hoa, amenities, access, utilities);
        this.gridConfig = this.getGridConfig(
          details, hoa, amenities, access, utilities, offboarding, propertyAreaOptions, incompleteFields, this.form,
        );

        this.changeDetectionRef.markForCheck();
      });
  }

  private getFormGroup(): FormGroup {

    return this.formBuilder.group({
      details: this.propertyFormBuilder.getPropertyDetailsForm(false),
      hoa: this.propertyFormBuilder.getPropertyHoaForm(),
      amenities: this.propertyFormBuilder.getPropertyAmenitiesForm(false),
      access: this.propertyFormBuilder.getPropertyAccessForm(false),
      utilities: this.propertyFormBuilder.getPropertyUtilitiesForm(false),
    });
  }

  private patchForm(
    details: IMyndPropertyDetailsDto,
    hoa: IMyndPropertyHoaDto,
    amenities: IMyndPropertyAmenitiesDto,
    access: IMyndPropertyAccessDto,
    utilities: IMyndPropertyUtilitiesDto,
  ): void {
    this.form.patchValue({
      amenities: propertyAmenitiesToForm(amenities),
      details: propertyDetailsToForm(details),
      hoa: { ...hoa },
      access: { ...access },
      utilities: propertyUtilitiesToForm(utilities),
    });
  }
}
