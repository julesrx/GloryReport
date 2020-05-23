import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BehaviorSubject, EMPTY } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';
import {
  DestinyManifest,
  DestinyInventoryItemDefinition,
  DestinyActivityDefinition,
  DestinyClassDefinition,
  DestinyRaceDefinition,
  DestinyMetricDefinition
} from 'bungie-api-ts/destiny2/interfaces';
import { ServerResponse } from 'bungie-api-ts/common';
import * as _ from 'lodash';

import { BungieHttpService } from './bungie-http.service';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class ManifestService {

  private db: LocalForage;

  public state: ManifestServiceState = {
    loaded: false
  };
  public state$ = new BehaviorSubject<ManifestServiceState>(this.state);

  public tables: string[] = ['InventoryItem', 'Activity', 'Class', 'Race', 'Metric'];
  public defs: {
    InventoryItem?: {
      get(hash: number): DestinyInventoryItemDefinition;
    },
    Activity?: {
      get(hash: number): DestinyActivityDefinition;
    },
    Class?: {
      get(hash: number): DestinyClassDefinition;
    },
    Race?: {
      get(hash: number): DestinyRaceDefinition;
    },
    Metric?: {
      get(hash: number): DestinyMetricDefinition;
    }
  };

  private definitions: BehaviorSubject<any>;

  private storeName = 'd2-manifest';

  private localManifestTables = 'd2-manifest-tables';
  private localManifestVersion = 'd2-manifest-version';
  private localManifestData = 'd2-manifest-data';

  constructor(
    private http: HttpClient,
    private bHttp: BungieHttpService,
    private storage: StorageService
  ) {
    this.db = this.storage.createInstance(this.storeName);
    this.defs = {};

    console.log('Loading manifest...');

    this.db.getItem<string>(this.localManifestVersion)
      .then((currentVersion: string) => {
        this.definitions = new BehaviorSubject(null);
        this.definitions.pipe(
          switchMap(() => {
            return this.bHttp.get('Destiny2/Manifest/');
          }),
          switchMap((res: ServerResponse<DestinyManifest>) => {
            // TODO: add language support
            const path: string = res.Response.jsonWorldContentPaths['en'];
            const version: string = path;

            const currentTables: string[] = JSON.parse(localStorage.getItem(this.localManifestTables) || '[]');

            try {
              if (currentVersion === version && this.arrayAreEqual(currentTables, this.tables)) {
                const manifest: Promise<object> = this.db.getItem<object>(this.localManifestData);

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
                  map(response => {
                    const manifest = _.pick(
                      response,
                      ...this.tables.map(t => `Destiny${t}Definition`)
                    );

                    this.saveToDB(manifest, version);
                    return response;
                  })
                );
            }
          }),
          map(manifest => {
            this.tables.forEach(tableShort => {
              const table = `Destiny${tableShort}Definition`;
              this.defs[tableShort] = {
                get(hash: number) {
                  const db = manifest[table];
                  if (!db) {
                    throw new Error(`Table ${table} does not exist in the manifest`);
                  }

                  return db[hash];
                }
              };
            });

            this.loaded = true;
          }),
          catchError((err) => {
            console.error(err.message || err);
            this.db.removeItem(this.localManifestData);
            this.db.removeItem(this.localManifestVersion);

            return EMPTY;
          })
        ).subscribe(); // need 114-155 ?
      });
  }

  set loaded(loaded: boolean) {
    this.setState({ loaded });
  }

  private async saveToDB(manifest: object, version: string) {
    try {
      await this.db.setItem(this.localManifestData, manifest)
        .then(() => {
          console.log(`Sucessfully stored manifest file.`);
          this.db.setItem(this.localManifestVersion, version);
          localStorage.setItem(this.localManifestTables, JSON.stringify(this.tables));
        });
    } catch (e) {
      console.error('Error saving manifest file', e);
    }
  }

  private setState(newState: Partial<ManifestServiceState>) {
    this.state = { ...this.state, ...newState };
    this.state$.next(this.state);
  }

  private arrayAreEqual(array1: string[], array2: string[]): boolean {
    return _.isEqual(_.sortBy(array1), _.sortBy(array2));
  }
}

export interface ManifestServiceState {
  loaded: boolean;
}
