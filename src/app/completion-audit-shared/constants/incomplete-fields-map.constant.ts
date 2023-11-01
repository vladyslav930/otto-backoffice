export const propertyIncompleteFieldsMap = {
  hasHoa: 'hoa.hasHoa',
  accountNumber: 'hoa.hoa.accountNumber',
  ccRsOnFile: 'hoa.hoa.ccRsOnFile',
  duesAmount: 'hoa.hoa.duesAmount',
  email: 'hoa.hoa.email',
  mailingAddress: 'hoa.hoa.mailingAddress',
  name: 'hoa.hoa.name',
  notes: 'hoa.hoa.notes',
  password: 'hoa.hoa.password',
  paymentsDue: 'hoa.hoa.paymentsDue',
  // @deprecated
  paymentsFrequency: 'hoa.hoa.paymentsFrequency',
  paymentsFrequencyVarchar: 'hoa.hoa.paymentsFrequency',
  phone: 'hoa.hoa.phone',
  residentRulesRegulationsOnFile: 'hoa.hoa.residentRulesRegulationsOnFile',
  website: 'hoa.hoa.website',

  hasWarranty: 'details.warranty.hasWarranty',
  warrantyCompany: 'details.warranty.company',
  warrantyExpirationDate: 'details.warranty.expirationDate',
  warrantyPhone: 'details.warranty.phone',
  warrantyPolicy: 'details.warranty.policy',

  petsPetDeposit: 'amenities.pets.petDeposit',
  petsPetDepositType: 'amenities.pets.petDepositType',
  petsPetRent: 'amenities.pets.petRent',
  petsPetsAllowed: 'amenities.pets.petsAllowed',
  petsPetsNumber: 'amenities.pets.petsNumber',

  transunionScreeningLevel: 'amenities.transunionScreeningLevel',
  floors: 'amenities.floors',

  parkingIncluded: 'amenities.parking.included',
  parkingRentAmount: 'amenities.parking.rentAmount',

  amenityPool: 'amenities.poolDetails.pool',
  amenityHotTub: 'amenities.hotTubDetails.hotTub',
  amenityHasOnsiteLaundry: 'amenities.onsiteLaundry',

  amenityElevator: 'amenities.amenities.elevator',
  amenityFitnessCenter: 'amenities.amenities.fitnessCenter',
  amenityGatedAccess: 'amenities.amenities.gatedAccess',
  amenityRoofTopPatio: 'amenities.amenities.roofTopPatio',
  amenitySmokeFree: 'amenities.amenities.smokeFree',

  hasRubs: 'utilities.rubs.hasRubs',
  // @deprecated
  electric: 'utilities.rubs.electric',
  electricVarchar: 'utilities.rubs.electric',
  // @deprecated
  gas: 'utilities.rubs.gas',
  gasVarchar: 'utilities.rubs.gas',
  // @deprecated
  sewer: 'utilities.rubs.sewer',
  sewerVarchar: 'utilities.rubs.sewer',
  // @deprecated
  trash: 'utilities.rubs.trash',
  trashVarchar: 'utilities.rubs.trash',
  // @deprecated
  water: 'utilities.rubs.water',
  waterVarchar: 'utilities.rubs.water',

  camPercent: 'utilities.rubs.camPercent',
  rubsProviderId: 'utilities.rubs.rubsProviderId',
  setUpDate: 'utilities.rubs.setUpDate',
  other: 'utilities.rubs.other',

  onsiteHasOnsiteManager: 'details.onsiteManager.hasOnsiteManager',
  onsiteManagerEmail: 'details.onsiteManager.email',
  onsiteManagerName: 'details.onsiteManager.name',
  onsiteManagerPhone: 'details.onsiteManager.phone',

  managedPaymentUtilities: 'utilities.managedPaymentUtilities',

  accessHasPropertyAccessLocked: 'access.hasPropertyAccessLocked',

  managedSinceDate: 'details.onboarding.managedSinceDate',
  estimatedManagedSinceDate: 'details.onboarding.estimatedManagedSinceDate',
  myndPma: 'details.onboarding.myndPma',
  type: 'details.type',
  apn: 'details.apn',
  areaId: 'details.areaId',
};

export const unitIncompleteFieldsMap = {
  airConditioner: 'amenities.airConditioner',
  attic: 'amenities.attic',
  balcony: 'amenities.balcony',
  basement: 'amenities.basement',
  ceilingFan: 'amenities.ceilingFan',
  disabledAccess: 'amenities.disabledAccess',
  dishwasher: 'amenities.dishwasher',
  doublePaneWindows: 'amenities.doublePaneWindows',
  dryer: 'amenities.dryer',
  fireplace: 'amenities.fireplace',
  // @deprecated
  fireplaceType: 'amenities.fireplaceType',
  fireplaceTypeVarchar: 'amenities.fireplaceType',
  furnished: 'amenities.furnished',
  garage: 'amenities.garage',
  // @deprecated
  garageType: 'amenities.garageType',
  garageTypeVarchar: 'amenities.garageType',
  garbageDisposal: 'amenities.garbageDisposal',
  // @deprecated
  heatingFuel: 'amenities.heatingFuel',
  heatingFuelVarchar: 'amenities.heatingFuel',
  // @deprecated
  heatingSystem: 'amenities.heatingSystem',
  heatingSystemVarchar: 'amenities.heatingSystem',
  landscapingIncluded: 'amenities.landscapingIncluded',
  microwave: 'amenities.microwave',
  otherAmenities: 'amenities.otherAmenities',
  patio: 'amenities.patio',
  porch: 'amenities.porch',
  privateBalcony: 'amenities.privateBalcony',
  privatePatio: 'amenities.privatePatio',
  // @deprecated
  rangeOven: 'amenities.rangeOven',
  rangeOvenVarchar: 'amenities.rangeOven',
  refrigerator: 'amenities.refrigerator',
  securityDoor: 'amenities.securityDoor',
  smartLock: 'amenities.smartLock',
  trashCompactor: 'amenities.trashCompactor',
  washer: 'amenities.washer',
  wdHookups: 'amenities.wdHookups',
  wdInUnit: 'amenities.wdInUnit',

  accessType: 'access.accessType',
  agentShowingRequired: 'access.agentShowing.agentShowingRequired',
  codeboxLocationDescription: 'access.codeBox.locationDescription',
  codeBoxLocationPhotoFileId: 'access.codeBox.locationPhotoFileId',
  codeBoxSerial: 'access.codeBox.serial',
  smartLockInstallDate: 'access.smartLock.installDate',
  smartLockProvider: 'access.smartLock.provider',
  smartLockType: 'access.smartLock.type',
  smartlockSerial: 'access.smartLock.serial',

  address: 'details.address',
  bedroomsNumber: 'details.bedroomsNumber',
  floor: 'details.floor',
  fullBathroomsNumber: 'details.fullBathroomsNumber',
  halfBathroomsNumber: 'details.halfBathroomsNumber',
  mailboxNumber: 'details.mailboxNumber',
  number: 'details.number',
  ownerOccupied: 'details.ownerOccupied',
  shortTermRentals: 'details.shortTermRentals',
  squareFootage: 'details.squareFootage',

  utilityFlatFee: 'utilities.flatFee',
  rentalDetailFlatFeeAmount: 'rentalDetails.flatFeeAmount',
  rubsEnabled: 'utilities.rubsEnabled',
  rubsEnabledOnDate: 'utilities.rubs.enabledOnDate',

  // @deprecated
  cablePaidBy: 'utilities.cablePaidBy',
  cablePaidByVarchar: 'utilities.cablePaidBy',
  // @deprecated
  electricPaidBy: 'utilities.electricPaidBy',
  electricPaidByVarchar: 'utilities.electricPaidBy',
  // @deprecated
  gasPaidBy: 'utilities.gasPaidBy',
  gasPaidByVarchar: 'utilities.gasPaidBy',
  // @deprecated
  internetPaidBy: 'utilities.internetPaidBy',
  internetPaidByVarchar: 'utilities.internetPaidBy',
  // @deprecated
  sewerPaidBy: 'utilities.sewerPaidBy',
  sewerPaidByVarchar: 'utilities.sewerPaidBy',
  // @deprecated
  trashPaidBy: 'utilities.trashPaidBy',
  trashPaidByVarchar: 'utilities.trashPaidBy',
  // @deprecated
  waterPaidBy: 'utilities.waterPaidBy',
  waterPaidByVarchar: 'utilities.waterPaidBy',

  parkingSpaceType: 'parking.parkingSpaceType',

  rentalDetailMarketingDescription: 'rentalDetails.marketingDescription',
  rentalDetailMarketingHeader: 'rentalDetails.marketingHeader',
  rentalDetailTargetRentAmount: 'rentalDetails.targetRentAmount',
  rentalDetailVacantReadyDate: 'rentalDetails.vacantReadyDate',
};
