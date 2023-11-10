import { fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { MYND_WINDOW } from '@myndmanagement/common';
import { MyndEntityService, MyndOwnerModel, MyndOwnerV2Service } from '@myndmanagement/services-otto';
import { MyndStoreSelectModule } from '@myndmanagement/store-select';
import { byMyndControl } from '@myndmanagement/test';
import { Spectator, createComponentFactory, mockProvider } from '@ngneat/spectator/jest';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { of } from 'rxjs';

import { PlacesAutocompleteService } from '../../../shared/services/google-places.service';
import { SharedModule } from '../../../shared/shared.module';
import { CreateEntityEffects } from '../../store/effects/create-entity.effects';
import { entitiesReducer, entitiesStateKey } from '../../store/reducers';

import { CreateEntityComponent } from './create-entity.component';

describe('CreateEntityComponent', () => {
  let spectator: Spectator<CreateEntityComponent>;
  const router = {
    navigate: jest.fn(() => of(true).toPromise()),
  };
  const createComponent = createComponentFactory({
    component: CreateEntityComponent,
    imports: [
      StoreModule.forRoot({
        [entitiesStateKey]: entitiesReducer,
      }),
      EffectsModule.forRoot([CreateEntityEffects]),
      MyndStoreSelectModule,
      SharedModule,
    ],
    providers: [
      mockProvider(Router, router),
      mockProvider(MyndEntityService, {
        createEntity: jest.fn(() => of({
          entityId: 'newlyCreatedEntityId',
        })),
      }),
      mockProvider(MyndOwnerV2Service, {
        searchOwners: jest.fn(() => of([
          {
            ownerId: 'testedOwnerId',
            fullName: 'Owen Owner',
          },
        ] as MyndOwnerModel[])),
      }),
      mockProvider(PlacesAutocompleteService, {
        getPredictions: jest.fn(() => of([])),
      }),
      {
        provide: MYND_WINDOW,
        useFactory: () => ({
          location: {
            href: '',
          },
        }),
      },
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  it('creates new entity and redirects user to it', fakeAsync(() => {
    spectator.fillForm([
      {
        in: byMyndControl('Legal Name'),
        value: 'Corpy Corp',
      },
      {
        in: byMyndControl('Owner'),
        value: 'Owen Owner',
      },
      {
        in: byMyndControl('Bank Account #'),
        value: '374383882',
      },
      {
        in: byMyndControl('Bank Routing #'),
        value: '123456789',
      },
      {
        in: byMyndControl('City'),
        value: 'San Francisco',
      },
      {
        in: byMyndControl('State'),
        value: 'California',
      },
      {
        in: byMyndControl('Zip Code'),
        value: '1144',
      },
    ]);
    spectator.typeInElement(
      'Main St. 1024',
      spectator.query(byMyndControl('Mailing Address')).querySelector('input'),
    );
    tick(400);

    spectator.query<HTMLFormElement>('form').submit();

    expect(spectator.inject(MyndEntityService).createEntity).toBeCalledWith({
      accountNumber: '374383882',
      country: 'US',
      address: 'Main St. 1024',
      businessLegalName: 'Corpy Corp',
      city: 'San Francisco',
      ownerId: 'testedOwnerId',
      routingNumber: '123456789',
      state: 'CA',
      zip: '1144',
    });
    expect(router.navigate).toBeCalledTimes(1);
    expect(router.navigate).toBeCalledWith(['entities', 'newlyCreatedEntityId']);
  }));
});
