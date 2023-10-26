import { Injectable } from '@angular/core';
import { MyndHttpService } from '@myndmanagement/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { LocationReferenceType } from '../constants/location-reference-type.constant';
import { IAssetInventory, ICreateAssetInventory, IUpdateAssetInventory } from '../interfaces/asset-inventory.interface';

@Injectable()
export class AssetInventoryService extends MyndHttpService {
  readonly endpoint = 'v2/properties/asset-inventories';

  list(locationReferenceId: string, locationReferenceType: LocationReferenceType): Observable<IAssetInventory[]> {
    return this.get(`${this.endpoint}/by-reference`, { locationReferenceId, locationReferenceType })
      .pipe(map(response => response.objects));
  }

  create(request: ICreateAssetInventory): Observable<void> {
    return this.post(`${this.endpoint}/create`, request);
  }

  update(request: IUpdateAssetInventory): Observable<void> {
    return this.post(`${this.endpoint}/update`, request);
  }

  remove(assetInventoryId: string): Observable<void> {
    return this.post(`${this.endpoint}/remove`, { assetInventoryId });
  }
}
