import { Action, createReducer, on } from '@ngrx/store';

import { initialLoadingState } from '../../../shared/constants/initial-loading-state.constant';
import { ILoadingState } from '../../../shared/interfaces/loading-state.interface';
import { IIncompleteFields } from '../../interfaces/completeness.interface';
import {
  getCompletenessCompleted,
  getCompletenessFailed,
  getIncompleteFieldsCompleted,
  getInstitutionalCompletenessCompleted,
  getInstitutionalCompletenessFailed,
  getInstitutionalIncompleteFieldsCompleted,
  startEditing,
  stopEditing,
  updateIncompleteFields,
  updateInstitutionalIncompleteFields,
} from '../actions/completion.actions';

export interface ICompletionState {
  incompleteFields: IIncompleteFields;
  institutionalIncompleteFields: IIncompleteFields;
  incompleteFieldsLoadingState: ILoadingState;
  institutionalIncompleteFieldsLoadingState: ILoadingState;
  insightCompleteness: string;
  institutionalInsightCompleteness: string;
  isEditing: boolean;
}

export const completionInitialState: ICompletionState = {
  incompleteFields: undefined,
  institutionalIncompleteFields: undefined,
  incompleteFieldsLoadingState: {
    ...initialLoadingState,
  },
  institutionalIncompleteFieldsLoadingState: {
    ...initialLoadingState,
  },
  insightCompleteness: '',
  institutionalInsightCompleteness: '',
  isEditing: false,
};

export const completionStateKey = 'completion';

export interface ICompletionSlice {
  [completionStateKey]: ICompletionState;
}

const reducer = createReducer<ICompletionState>(
  completionInitialState,

  on(updateIncompleteFields, state => ({
    ...state,
    incompleteFieldsLoadingState: {
      ...initialLoadingState,
      processing: true,
    },
  })),

  on(getIncompleteFieldsCompleted, (state, { incompleteFields }) => ({
    ...state,
    incompleteFields,
    incompleteFieldsLoadingState: {
      ...initialLoadingState,
      completed: true,
    },
  })),

  on(getCompletenessCompleted, (state, { completeness }) => ({
    ...state,
    insightCompleteness: completeness,
  })),
  on(getCompletenessFailed, state => ({
    ...state,
    insightCompleteness: '',
  })),

  on(updateInstitutionalIncompleteFields, state => ({
    ...state,
    institutionalIncompleteFieldsLoadingState: {
      ...initialLoadingState,
      processing: true,
    },
  })),

  on(getInstitutionalIncompleteFieldsCompleted, (state, { incompleteFields }) => ({
    ...state,
    institutionalIncompleteFields: incompleteFields,
    institutionalIncompleteFieldsLoadingState: {
      ...initialLoadingState,
      completed: true,
    },
  })),

  on(getInstitutionalCompletenessCompleted, (state, { completeness }) => ({
    ...state,
    institutionalInsightCompleteness: completeness,
  })),
  on(getInstitutionalCompletenessFailed, state => ({
    ...state,
    institutionalInsightCompleteness: '',
  })),

  on(startEditing, state => ({
    ...state,
    isEditing: true,
  })),

  on(stopEditing, state => ({
    ...state,
    isEditing: false,
  })),
);

export function completionReducer(state: ICompletionState | undefined, action: Action): ICompletionState {
  return reducer(state, action);
}
