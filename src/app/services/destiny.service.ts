import { Injectable } from '@angular/core';

import { Observable, from, of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { UserInfoCard } from 'bungie-api-ts/user/interfaces';
import { BungieMembershipType, ServerResponse } from 'bungie-api-ts/common';
import {
  DestinyProfileResponse,
  DestinyPostGameCarnageReportData,
  DestinyActivityHistoryResults
} from 'bungie-api-ts/destiny2/interfaces';

import { BungieHttpService } from './bungie-http.service';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class DestinyService {

  private db: LocalForage;
  private storeName = 'request-cache';

  constructor(
    private bHttp: BungieHttpService,
    private storage: StorageService
  ) {
    this.db = this.storage.createInstance(this.storeName);
  }

  public searchPlayer(displayName: string, membershipType: BungieMembershipType = BungieMembershipType.All)
    : Observable<ServerResponse<UserInfoCard[]>> {
    return this.bHttp.get(`Destiny2/SearchDestinyPlayer/${membershipType}/${encodeURIComponent(displayName)}/`);
  }

  public getProfile(membershipType: BungieMembershipType, membershipId: string, components: string = '100,200')
    : Observable<ServerResponse<DestinyProfileResponse>> {
    return this.bHttp.get(`Destiny2/${membershipType}/Profile/${membershipId}/`, false, { components: components })
  }

  public getActivities(membershipType: BungieMembershipType, membershipId: string, characterId: string, options: any)
    : Observable<ServerResponse<DestinyActivityHistoryResults>> {
    return this.bHttp.get(`Destiny2/${membershipType}/Account/${membershipId}/Character/${characterId}/Stats/Activities/`, true, options)
  }

  public getPGCR(instanceId: string): Observable<DestinyPostGameCarnageReportData> {
    return this.getCachedRequest<DestinyPostGameCarnageReportData>(`Destiny2/Stats/PostGameCarnageReport/${instanceId}/`);
  }

  public getCachedRequest<T>(url: string): Observable<any> {
    return from(this.db.getItem<T>(url))
      .pipe(
        switchMap((data: T) => {
          if (!data) {
            return this.bHttp.get(url, true) // check if errors are not saved in cache
              .pipe(
                map((res: ServerResponse<T>) => {
                  this.setCachedRequest<T>(url, res.Response);
                  return res.Response;
                })
              );
          } else {
            return of(data);
          }
        })
      )
  }

  public setCachedRequest<T>(url: string, data: T): void {
    this.db.setItem(url, {
      date: new Date(),
      response: data
    });
  }

}
