import { Injectable } from '@angular/core';

import { DestinyManifest } from 'bungie-api-ts/destiny2/interfaces';
import { ServerResponse } from 'bungie-api-ts/common';

import { BungieHttpService } from './bungie-http.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ManifestService {

  private localManifestVersion: string = 'd2-manifest-version';
  private localManifestData: string = 'd2-manifest';

  constructor(
    private http: HttpClient,
    private bHttp: BungieHttpService
  ) { }

  // voir ligne 51-110
  loadManifest() {
    this.bHttp.get('/Destiny2/Manifest/')
      .subscribe((res: ServerResponse<DestinyManifest>) => {
        let manifest: DestinyManifest = res.Response;

        console.log(manifest.version);

        // if manifest version diff
        if (true) {
          // this.http.get(`https://www.bungie.net${manifest.jsonWorldComponentContentPaths['en']['DestinyInventoryItemLiteDefinition']}`)
          //   .subscribe(res => { });
        }
      });
  }
}
