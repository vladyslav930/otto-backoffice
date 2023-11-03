import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { first } from 'rxjs/operators';

import { loadUnitDetails } from '../../units-shared/store/actions/units-details.actions';
import { CompletionStoreType } from '../store/reducers';
import { selectSelectedUnitId } from '../store/selectors/completion.selectors';

@Injectable()
export class UnitDetailsResolver implements Resolve<boolean> {
  constructor(private store: Store<CompletionStoreType>) {}

  resolve(): Observable<boolean> {
    this.store.select(selectSelectedUnitId).pipe(
      first(Boolean),
    ).subscribe((unitId: string) => {
      this.store.dispatch(loadUnitDetails({ unitId }));
    });
    return of(true);
  }
}
