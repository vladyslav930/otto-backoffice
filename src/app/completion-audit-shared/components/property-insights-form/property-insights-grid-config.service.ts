import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { IMyndOption } from '@myndmanagement/forms';
import {
  IMyndPropertyAccessDto,
  IMyndPropertyAmenitiesDto,
  IMyndPropertyDetailsDto,
  IMyndPropertyHoaDto,
  IMyndPropertyOffboardingDto,
  IMyndPropertyUtilitiesDto,
} from '@myndmanagement/services-otto';

import {
  PropertyAmenitiesConfigService,
} from '../../../property-shared/services/editable-grid-configs/property-amenities-config.service';
import {
  PropertyHoaConfigService,
} from '../../../property-shared/services/editable-grid-configs/property-hoa-config.service';
import {
  PropertyHoaContactsConfigService,
} from '../../../property-shared/services/editable-grid-configs/property-hoa-contacts-config.service';
import {
  PropertyOnsiteManagerConfigService,
} from '../../../property-shared/services/editable-grid-configs/property-onsite-manager-config.service';
import {
  PropertyOtherFieldsConfigService,
} from '../../../property-shared/services/editable-grid-configs/property-other-fields-config.service';
import {
  PropertyParkingConfigService,
} from '../../../property-shared/services/editable-grid-configs/property-parking-config.service';
import {
  PropertyPetsConfigService,
} from '../../../property-shared/services/editable-grid-configs/property-pets-config.service';
import {
  PropertyRubsConfigService,
} from '../../../property-shared/services/editable-grid-configs/property-rubs-config.service';
import {
  PropertyWarrantyConfigService,
} from '../../../property-shared/services/editable-grid-configs/property-warranty-config.service';
import { IEditableGridConfig } from '../../../shared/interfaces/editable-grid/editable-grid-config.interface';

@Injectable({ providedIn: 'root' })
export class PropertyInsightsGridConfigService {
  constructor(
    private hoaConfigService: PropertyHoaConfigService,
    private hoaContactsConfigService: PropertyHoaContactsConfigService,
    private warrantyConfigService: PropertyWarrantyConfigService,
    private petsConfigService: PropertyPetsConfigService,
    private parkingConfigService: PropertyParkingConfigService,
    private otherFieldsConfigService: PropertyOtherFieldsConfigService,
    private amenitiesConfigService: PropertyAmenitiesConfigService,
    private rubsConfigService: PropertyRubsConfigService,
    private onsiteManagerConfigService: PropertyOnsiteManagerConfigService,
  ) {}

  buildConfig(
    details: IMyndPropertyDetailsDto,
    hoa: IMyndPropertyHoaDto,
    amenities: IMyndPropertyAmenitiesDto,
    access: IMyndPropertyAccessDto,
    utilities: IMyndPropertyUtilitiesDto,
    offboarding: IMyndPropertyOffboardingDto,
    propertyAreaOptions: IMyndOption[],
    form: FormGroup,
  ): IEditableGridConfig {
    return {
      sections: [
        {
          items: [
            this.otherFieldsConfigService.buildPropertyManagedSinceDate(details, offboarding),
            this.otherFieldsConfigService.buildPropertyEstimatedManagedSinceDate(details),
            this.otherFieldsConfigService.buildPropertyMyndPma(details),
            this.otherFieldsConfigService.buildPropertyType(details),
            this.otherFieldsConfigService.buildPropertyAreaId(details, propertyAreaOptions),
            this.otherFieldsConfigService.buildPropertyApn(details),
          ],
          name: 'General',
        },
        this.hoaConfigService.buildSectionConfig(
          hoa,
          form,
        ),
        this.hoaContactsConfigService.buildSectionConfig(
          hoa,
          form,
        ),
        this.warrantyConfigService.buildSectionConfig(
          details,
          form,
        ),
        this.amenitiesConfigService.buildSectionConfig(
          amenities,
          form,
        ),
        this.petsConfigService.buildSectionConfig(
          amenities,
          hoa,
          form,
        ),
        this.parkingConfigService.buildSectionConfig(amenities),
        {
          items: [
            this.otherFieldsConfigService.buildTransunionScreeningLevelCell(amenities),
            this.otherFieldsConfigService.buildFloorsScreeningLevelCell(amenities),
            this.otherFieldsConfigService.buildPayingUtilitiesCell(utilities),
            this.otherFieldsConfigService.buildPropertyAccessLocked(access),
          ],
          name: 'Other',
        },
        this.rubsConfigService.buildSectionConfig(utilities, form),
        this.onsiteManagerConfigService.buildSectionConfig(details, form),
      ],
    };
  }
}
