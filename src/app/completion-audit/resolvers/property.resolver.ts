import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { myndSelectRouteParam } from '@myndmanagement/store-select';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { first } from 'rxjs/operators';

import { getPropertyAction } from '../../property-shared/store/actions/property.actions';
import { CompletionAuditStoreType } from '../store/reducers';

@Injectable()
export class PropertyResolver implements Resolve<boolean> {
  constructor(private store: Store<CompletionAuditStoreType>) { }

  resolve(): Observable<boolean> {
    this.store.select(myndSelectRouteParam('propertyId')).pipe(
      first<string>(Boolean),
    ).subscribe((propertyId) => {
      this.store.dispatch(getPropertyAction({ propertyId }));
    });
    return of(true);
  }
}
