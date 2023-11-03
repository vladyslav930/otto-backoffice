import { createAction, props } from '@ngrx/store';

import { IIncompleteFields } from '../../interfaces/completeness.interface';

export const updateIncompleteFields = createAction('[Insights] Update Incomplete Fields', props<{ propertyId: string }>());
export const updateInstitutionalIncompleteFields = createAction('[Insights] Update Institutional Incomplete Fields', props<{ propertyId: string }>());

export const getIncompleteFields = createAction('[Insights] Get Incomplete Fields', props<{ propertyId: string }>());
export const getIncompleteFieldsCompleted = createAction('[Insights] Get Incomplete Fields Completed', props<{ incompleteFields: IIncompleteFields }>());
export const getIncompleteFieldsFailed = createAction('[Insights] Get Incomplete Fields Failed');

export const getCompleteness = createAction('[Insights] Get Insights Completeness', props<{ propertyId: string }>());
export const getCompletenessCompleted = createAction('[Insights] Get Insights Completeness Completed', props<{ completeness: string }>());
export const getCompletenessFailed = createAction('[Insights] Get Insights Completeness Failed');

export const getInstitutionalIncompleteFields = createAction('[Insights] Get Institutional Incomplete Fields', props<{ propertyId: string }>());
export const getInstitutionalIncompleteFieldsCompleted = createAction('[Insights] Get Institutional Incomplete Fields Completed', props<{ incompleteFields: IIncompleteFields }>());
export const getInstitutionalIncompleteFieldsFailed = createAction('[Insights] Get Institutional Incomplete Fields Failed');

export const getInstitutionalCompleteness = createAction('[Insights] Get Institutional Insights Completeness', props<{ propertyId: string }>());
export const getInstitutionalCompletenessCompleted = createAction('[Insights] Get Institutional Insights Completeness Completed', props<{ completeness: string }>());
export const getInstitutionalCompletenessFailed = createAction('[Insights] Get Institutional Insights Completeness Failed');

export const startEditing = createAction('[Insights] Start Editing');
export const stopEditing = createAction('[Insights] Stop Editing');
