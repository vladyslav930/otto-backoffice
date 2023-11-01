import { CompletenessResolver } from './completeness.resolver';
import { IncompleteFieldsResolver } from './incomplete-fields.resolver';
import { InstitutionalCompletenessResolver } from './institutional-completeness.resolver';
import { InstitutionalIncompleteFieldsResolver } from './institutional-incomplete-fields.resolver';
import { UnitDetailsResolver } from './unit-details.resolver';
import { UnitsListResolver } from './units-list.resolver';

export const resolvers = [
  CompletenessResolver,
  IncompleteFieldsResolver,
  InstitutionalCompletenessResolver,
  InstitutionalIncompleteFieldsResolver,
  UnitDetailsResolver,
  UnitsListResolver,
];
