import { Pipe, PipeTransform } from '@angular/core';

import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { ManifestService } from '../services/manifest.service';

@Pipe({
  name: 'destinyItemHash'
})
export class DestinyItemHashPipe implements PipeTransform {

  private baseUrl: string = 'https://www.bungie.net';

  constructor(private manifestService: ManifestService) { }

  transform(hash: number): Observable<string> {
    return this.manifestService.state$
      .pipe(
        map(state => {
          if (state.loaded) {
            return this.manifestService.InventoryItem.get(hash).displayProperties.name;
          }
        })
      );
  }
}
