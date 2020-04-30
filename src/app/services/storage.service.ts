import { Injectable } from '@angular/core';

import * as localForage from 'localforage';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private dbName: string = 'Glory.report';

  constructor() { }

  public createInstance(storeName: string): LocalForage {
    return localForage.createInstance({
      name: this.dbName,
      storeName: storeName
    });
  }

}
