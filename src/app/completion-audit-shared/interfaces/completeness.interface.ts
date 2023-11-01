export interface IIncompleteFields {
  onboardingInsightsId: string;
  propertyId: string;
  incompleteFields: string[];
  owner: IOwnerIncompleteFields;
  units: IUnitIncompleteField[];
}

export interface IOwnerIncompleteFields {
  incompleteFields: string[];
  ownerId: string;
}

export interface IUnitIncompleteField {
  unitId: string;
  incompleteFields: string[];
  leases: ILeaseIncompleteFields[];
}

export interface ILeaseIncompleteFields {
  incompleteFields: string[];
  leaseFlowId: string;
}
