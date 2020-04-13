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

  transform(hash: number, table?: string, type?: string): Observable<string> {
    return this.manifestService.state$
      .pipe(
        map(state => {
          if (state.loaded) {
            switch (table) {
              case 'InventoryItem':
                switch (type) {
                  case 'name':
                    return this.manifestService.defs.InventoryItem.get(hash).displayProperties.name;

                  case 'icon':
                    return this.baseUrl + this.manifestService.defs.InventoryItem.get(hash).displayProperties.icon;

                  default:
                    return '';
                }

              default:
                return '';
            }
          }
        })
      );
  }
}
