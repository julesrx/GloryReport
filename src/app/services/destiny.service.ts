import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { UserInfoCard } from 'bungie-api-ts/user/interfaces';
import { BungieMembershipType, ServerResponse } from 'bungie-api-ts/common';
import {
  DestinyProfileResponse,
  DestinyPostGameCarnageReportData,
  DestinyActivityHistoryResults
} from 'bungie-api-ts/destiny2/interfaces';

import { BungieHttpService } from './bungie-http.service';

@Injectable({
  providedIn: 'root'
})
export class DestinyService {

  constructor(private bHttp: BungieHttpService) { }

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

  public getPGCR(instanceId: string): Observable<ServerResponse<DestinyPostGameCarnageReportData>> {
    return this.bHttp.get(`Destiny2/Stats/PostGameCarnageReport/${instanceId}/`, true)
  }

}
