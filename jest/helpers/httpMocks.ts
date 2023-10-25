import { TestBed } from '@angular/core/testing';
import { MyndHttpService } from '@myndmanagement/common';
import { of } from 'rxjs';

export function mockBackendGet(): void {
  const service = TestBed.inject(MyndHttpService);
  jest.spyOn(service, 'get').mockImplementation(() => of({}));
}
