import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { first, switchMap } from 'rxjs/operators';

import {
  selectLoadingPropertyDetails,
  selectPropertyId,
} from '../../property-shared/store/selectors/property-details.selectors';
import { loadUnitsList } from '../../units-shared/store/actions/units-list.actions';
import { CompletionStoreType } from '../store/reducers';

@Injectable({ providedIn: 'root' })
export class UnitsListResolver implements Resolve<boolean> {
  constructor(private store: Store<CompletionStoreType>) { }

  resolve(): Observable<boolean> {
    this.store.select(selectLoadingPropertyDetails).pipe(
      first(propertyLoading => !propertyLoading),
      switchMap(() => this.store.select(selectPropertyId)),
      first<string>(Boolean),
    ).subscribe((propertyId) => {
      this.store.dispatch(loadUnitsList({ propertyId }));
    });
    return of(true);
  }
}
