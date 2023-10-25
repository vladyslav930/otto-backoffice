import { APP_BASE_HREF } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MyndCommonModule, MyndHttpService } from '@myndmanagement/common';
import { MyndCommonOttoModule } from '@myndmanagement/common-otto';
import { MyndFormsModule } from '@myndmanagement/forms';
import { MyndFormsOttoModule } from '@myndmanagement/forms-otto';
import { MyndLayoutModule } from '@myndmanagement/layout';
import { MyndModalsModule } from '@myndmanagement/modals';
import { MyndTableModule } from '@myndmanagement/table';
import { myndExtendSpectator } from '@myndmanagement/test';
import { MyndToastModule } from '@myndmanagement/toast';
import { MyndTooltipModule } from '@myndmanagement/tooltip';
import { defineGlobalsInjections } from '@ngneat/spectator';
import { mockProvider } from '@ngneat/spectator/jest';

Object.defineProperty(document, '__env', {
  writable: false,
  value: {
    apiRoot: '',
  },
});

myndExtendSpectator();

defineGlobalsInjections({
  imports: [
    MyndCommonModule.forRoot(),
    MyndCommonOttoModule,
    MyndFormsModule,
    MyndFormsOttoModule,
    MyndModalsModule,
    MyndTableModule,
    MyndLayoutModule,
    MyndTooltipModule,
    MyndToastModule,
    ReactiveFormsModule,
    RouterModule.forRoot([]),
  ],
  providers: [
    {
      provide: APP_BASE_HREF,
      useValue: '',
    },
    mockProvider(MyndHttpService),
  ],
});
