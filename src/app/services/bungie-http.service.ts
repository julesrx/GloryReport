import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';

import { ServerResponse, BungieMembershipType } from 'bungie-api-ts/common';

@Injectable({
  providedIn: 'root'
})
export class BungieHttpService {

  public error: BehaviorSubject<ServerResponse<any>>;
  public membershipTypes: any[];

  public bungiePlatformEndpoint: string;
  public statsPlatformEndpoint: string;

  private _origin: string;
  private _apiKey: string;

  constructor(private http: HttpClient) {
    this.error = new BehaviorSubject(null);
    this._origin = window.location.protocol + '//' + window.location.hostname;
    switch (this._origin) {
      case 'http://dev.glory.report':
        this._apiKey = 'ecc34e9250b34803ae6e09405568df82';
        break;

      case 'https://glory.report':
        this._apiKey = '457b1436a98a4390be099a140c42fd3d';
        break;
    }

    this.membershipTypes = [
      { title: 'Xbox', icon: 'fab fa-xbox', value: BungieMembershipType.TigerXbox },
      { title: 'Playstation', icon: 'fab fa-playstation', value: BungieMembershipType.TigerPsn },
      { title: 'PC', icon: 'fab fa-windows', value: BungieMembershipType.TigerBlizzard }
    ];
  }

  get(url: string, stats: boolean = false): Observable<ServerResponse<any>> {
    const options = {
      headers: new HttpHeaders({
        'x-api-key': this._apiKey
      })
    };

    const endpoint: string = 'https://' + (stats ? 'stats' : 'www') + '.bungie.net/Platform/';
    return this.http.get<ServerResponse<any>>(endpoint + url, options);
  }

}
