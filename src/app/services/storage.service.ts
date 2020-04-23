import { Injectable } from '@angular/core';

import * as localForage from 'localforage';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private store: LocalForage;

  constructor() {
    this.store = localForage.createInstance({
      name: 'Glory.report',
      storeName: 'glory-report',
      description: `Glory.report's database`
    });
  }

  public getItem<T>(key: string): Promise<T> {
    return this.store.getItem<T>(key);
  }

  public setItem(key: string, value: any): Promise<any> {
    return this.store.setItem(key, value);
  }

  public removeItem(key: string): void {
    this.store.removeItem(key);
  }
}
