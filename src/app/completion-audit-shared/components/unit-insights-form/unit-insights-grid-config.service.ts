import { ChangeDetectorRef, Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { IMyndOption } from '@myndmanagement/forms';

import { IEditableGridConfig } from '../../../shared/interfaces/editable-grid/editable-grid-config.interface';
import { IUnit } from '../../../units-shared/interfaces/unit.interface';
import {
  UnitAccessSettingsConfigService,
} from '../../../units-shared/services/editable-grid-configs/unit-access-settings-config.service';
import {
  UnitDetailsGeneralConfigService,
} from '../../../units-shared/services/editable-grid-configs/unit-general-config.service';
import {
  UnitMarketingDescriptionConfigService,
} from '../../../units-shared/services/editable-grid-configs/unit-marketing-description-config.service';
import {
  UnitMarketingFieldsConfigService,
} from '../../../units-shared/services/editable-grid-configs/unit-marketing-fields-config.service';
import {
  UnitParkingConfigService,
} from '../../../units-shared/services/editable-grid-configs/unit-parking-config.service';
import {
  UnitUtilitiesPaymentsConfigService,
} from '../../../units-shared/services/editable-grid-configs/unit-utilities-payments-config.service';
import {
  UnitUtilitiesSettingsConfigService,
} from '../../../units-shared/services/editable-grid-configs/unit-utilities-settings-config.service';
import {
  buildUnitAmenitiesGeneralGridConfig,
} from '../../../units-shared/utils/grid-configs/unit-amenities-general-grid-config';
import {
  buildUnitAmenitiesHvacGridConfig,
} from '../../../units-shared/utils/grid-configs/unit-amenities-hvac-grid-config';
import {
  buildUnitAmenitiesKitchenGridConfig,
} from '../../../units-shared/utils/grid-configs/unit-amenities-kitchen-grid-config';
import {
  buildUnitAmenitiesLaundryGridConfig,
} from '../../../units-shared/utils/grid-configs/unit-amenities-laundry-grid-config';
import {
  buildUnitAmenitiesOtherGridConfig,
} from '../../../units-shared/utils/grid-configs/unit-amenities-other-grid-config';
import {
  buildUnitAmenitiesOutsideGridConfig,
} from '../../../units-shared/utils/grid-configs/unit-amenities-outside-grid-config';

@Injectable({ providedIn: 'root' })
export class UnitInsightsGridConfigService {
  constructor(
    private unitAccessSettingsService: UnitAccessSettingsConfigService,
    private unitDetailsGeneralConfigService: UnitDetailsGeneralConfigService,
    private unitUtilitiesSettingsService: UnitUtilitiesSettingsConfigService,
    private unitUtilitiesPaymentsService: UnitUtilitiesPaymentsConfigService,
    private unitParkingConfigService: UnitParkingConfigService,
    private unitMarketingFieldsConfigService: UnitMarketingFieldsConfigService,
    private unitMarketingDescriptionConfigService: UnitMarketingDescriptionConfigService,
  ) {}

  buildGridConfig(
    { details, parking, rentalDetails, amenities, access, utilities }: IUnit,
    availableSerials: IMyndOption[],
    responsibilities: IMyndOption[],
    form: FormGroup,
    changeDetectorRef: ChangeDetectorRef,
  ): IEditableGridConfig {
    return {
      sections: [
        this.unitDetailsGeneralConfigService.buildConfig(details, form),
        this.unitParkingConfigService.buildConfig(details, parking, null, form),

        this.unitMarketingDescriptionConfigService.buildConfig(rentalDetails),
        {
          items: [
            this.unitMarketingFieldsConfigService.buildTargetRentAmountConfig(details, rentalDetails),
            this.unitMarketingFieldsConfigService.buildVacantReadyDateConfig(rentalDetails),
          ].filter(Boolean),
          name: 'Unit details',
        },

        buildUnitAmenitiesGeneralGridConfig(amenities),
        buildUnitAmenitiesLaundryGridConfig(amenities, form),
        buildUnitAmenitiesHvacGridConfig(amenities),
        buildUnitAmenitiesKitchenGridConfig(amenities),
        buildUnitAmenitiesOutsideGridConfig(amenities, form),
        buildUnitAmenitiesOtherGridConfig(amenities, form),

        this.unitAccessSettingsService.buildConfig(access, details, form, availableSerials, changeDetectorRef),

        this.unitUtilitiesSettingsService.buildConfig(details, utilities, form),
        this.unitUtilitiesPaymentsService.buildConfig(utilities, responsibilities),
      ],
      searchSection: 'unit-talking-points',
    };
  }
}
