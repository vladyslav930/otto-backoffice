import { myndSelectQueryParam } from '@myndmanagement/store-select';
import { createFeatureSelector, createSelector } from '@ngrx/store';

import { selectUpdatingPropertyAccess } from '../../../property-shared/store/selectors/property-access.selectors';
import { selectUpdatingPropertyAmenities } from '../../../property-shared/store/selectors/property-amenities.selectors';
import { selectUpdatingPropertyDetails } from '../../../property-shared/store/selectors/property-details.selectors';
import { selectUpdatingPropertyHoa } from '../../../property-shared/store/selectors/property-hoa.selectors';
import { selectUpdatingPropertyUtilities } from '../../../property-shared/store/selectors/property-utilities.selectors';
import { selectIsUnitDetailsBusy } from '../../../units-shared/store/selectors/units-details.selectors';
import { CompletionStoreType } from '../reducers';
import { ICompletionState, completionStateKey } from '../reducers/completion.reducer';

export const selectOnboardingInsightsState = createFeatureSelector<CompletionStoreType, ICompletionState>(completionStateKey);

export const selectSelectedUnitId = createSelector(
  myndSelectQueryParam('unit'),
  (unitId: string): string => unitId,
);

export const selectIncompleteFields = createSelector(
  selectOnboardingInsightsState,
  state => state.incompleteFields,
);

export const selectInstitutionalIncompleteFields = createSelector(
  selectOnboardingInsightsState,
  state => state.institutionalIncompleteFields,
);
export const selectPropertyBusy = createSelector(
  selectUpdatingPropertyDetails,
  selectUpdatingPropertyHoa,
  selectUpdatingPropertyAmenities,
  selectUpdatingPropertyAccess,
  selectUpdatingPropertyUtilities,
  (details, hoa, amenities, access, utilities) => details || hoa || amenities || access || utilities,
);

export const selectIsTalkingPointsBusy = createSelector<CompletionStoreType, boolean, boolean, boolean, boolean, boolean, boolean, boolean>(
  selectUpdatingPropertyDetails,
  selectUpdatingPropertyHoa,
  selectUpdatingPropertyAmenities,
  selectUpdatingPropertyAccess,
  selectUpdatingPropertyUtilities,
  selectIsUnitDetailsBusy,
  (details, hoa, amenities, access, utilities, unitBusy) =>
    details || hoa || amenities || access || utilities || unitBusy,
);

export const selectIsIncompleteFieldsBusy = createSelector(
  selectIsTalkingPointsBusy,
  selectOnboardingInsightsState,
  (propertyBusy, state) =>
    propertyBusy || state.incompleteFieldsLoadingState.processing,
);

export const selectCompleteness = createSelector(
  selectOnboardingInsightsState,
  (state) => {
    const completeness = state.insightCompleteness;
    return (parseFloat(completeness) || 0) / 100;
  },
);

export const selectIsInstitutionalIncompleteFieldsBusy = createSelector(
  selectIsTalkingPointsBusy,
  selectOnboardingInsightsState,
  (propertyBusy, state) =>
    propertyBusy || state.institutionalIncompleteFieldsLoadingState.processing,
);

export const selectInstitutionalCompleteness = createSelector(
  selectOnboardingInsightsState,
  (state) => {
    const completeness = state.institutionalInsightCompleteness;
    return (parseFloat(completeness) || 0) / 100;
  },
);

export const selectIsEditing = createSelector(
  selectOnboardingInsightsState,
  state => state.isEditing,
);
