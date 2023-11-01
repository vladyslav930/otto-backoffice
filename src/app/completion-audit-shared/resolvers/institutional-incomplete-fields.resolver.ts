import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { IMyndPropertyDetailsDto } from '@myndmanagement/services-otto';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { first } from 'rxjs/operators';

import { selectPropertyDetails } from '../../property-shared/store/selectors/property-details.selectors';
import { getInstitutionalIncompleteFields } from '../store/actions/completion.actions';
import { CompletionStoreType } from '../store/reducers';

@Injectable()
export class InstitutionalIncompleteFieldsResolver implements Resolve<boolean> {
  constructor(private store: Store<CompletionStoreType>) { }

  resolve(): Observable<boolean> {
    this.store.select(selectPropertyDetails).pipe(
      first<IMyndPropertyDetailsDto>(Boolean),
    ).subscribe(({ propertyId }) => {
      this.store.dispatch(getInstitutionalIncompleteFields({ propertyId }));
    });
    return of(true);
  }
}
