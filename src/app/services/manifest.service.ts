import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BehaviorSubject } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { DestinyManifest } from 'bungie-api-ts/destiny2/interfaces';
import { ServerResponse } from 'bungie-api-ts/common';
import { get, set } from 'idb-keyval'; // TODO: use classic db instead https://github.com/axemclion/IndexedDBShim

import { BungieHttpService } from './bungie-http.service';

@Injectable({
  providedIn: 'root'
})
export class ManifestService {

  private definitions: BehaviorSubject<any>;

  private localManifestVersion: string = 'd2-manifest-version';
  private localManifestData: string = 'd2-manifest';

  constructor(
    private http: HttpClient,
    private bHttp: BungieHttpService
  ) {
    this.definitions = new BehaviorSubject(null);
    this.definitions.pipe(
      switchMap(() => {
        return this.bHttp.get('Destiny2/Manifest/');
      }),
      switchMap((res: ServerResponse<DestinyManifest>) => {
        const path: string = res.Response.jsonWorldComponentContentPaths['en']['DestinyInventoryItemLiteDefinition'];
        const version: string = path;

        try {
          const currentVersion: string = localStorage.getItem(this.localManifestVersion);

          if (currentVersion === version) {
            const manifest: Promise<object> = get<object>(this.localManifestData);

            if (!manifest) {
              throw new Error('Empty cached manifest file');
            }
            return manifest;
          } else {
            throw new Error(`version mismatch`);
          }
        } catch (e) {
          return this.http.get(`https://www.bungie.net${path}`)
            .pipe(
              map(manifest => {
                this.saveToDB(manifest, version);
                // this.newManifest$.next();

                return manifest;
              })
            );
        }
      })
    ).subscribe(); // need 114-155 ?
  }

  private async saveToDB(manifest: object, version: string) {
    try {
      await set(this.localManifestData, manifest);
      console.log(`Sucessfully stored manifest file.`);
      localStorage.setItem(this.localManifestVersion, version);
    } catch (e) {
      console.error('Error saving manifest file', e);
    }
  }
}
