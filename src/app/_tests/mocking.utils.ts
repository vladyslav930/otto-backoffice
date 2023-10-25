import { ClassProvider, Injectable, Provider } from '@angular/core';
import { ReducerManager } from '@ngrx/store';
import { MockReducerManager, provideMockStore } from '@ngrx/store/testing';

@Injectable()
export class MyndMockReducerProvider extends MockReducerManager {
  addFeatures(): void { }
}

export function myndProvideMockStore<T>(config: { initialState: T }): Provider[] {
  let data = provideMockStore(config);
  data = data.map((item) => {
    if (item.provide === ReducerManager) {
      (item as unknown as ClassProvider).useClass = MyndMockReducerProvider;
    }
    return item;
  });
  return data;
}
