import { Pipe, PipeTransform } from '@angular/core';

import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { ManifestService } from '../services/manifest.service';

@Pipe({
  name: 'destinyItemHash'
})
export class DestinyItemHashPipe implements PipeTransform {

  private baseUrl = 'https://www.bungie.net';

  constructor(private manifestService: ManifestService) { }

  transform(hash: number, type?: string): Observable<string> {
    return this.manifestService.state$
      .pipe(
        map(state => {
          if (state.loaded) {
            switch (type) {
              case 'itemName':
                return this.manifestService.defs.InventoryItem.get(hash).displayProperties.name;

              case 'itemIcon':
                return this.baseUrl + this.manifestService.defs.InventoryItem.get(hash).displayProperties.icon;

              case 'activityName':
                // cannot find some activities
                return this.manifestService.defs.Activity.get(hash)?.displayProperties.name;

              case 'className':
                return this.manifestService.defs.Class.get(hash)?.displayProperties.name;

              case 'raceName':
                return this.manifestService.defs.Race.get(hash)?.displayProperties.name;

              default:
                return '';
            }
          }
        })
      );
  }
}
