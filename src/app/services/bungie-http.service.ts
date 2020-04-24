import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { BehaviorSubject, Observable } from 'rxjs';

import { ServerResponse } from 'bungie-api-ts/common';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BungieHttpService {

  private origin: string;
  private key: string;

  public error: BehaviorSubject<ServerResponse<any>>;

  constructor(private http: HttpClient) {
    this.error = new BehaviorSubject(null);
    this.origin = window.location.protocol + '//' + window.location.hostname;
    this.key = environment.BUNGIE_API_KEY;
  }

  public get(url: string, stats: boolean = false, params: any = {}, headers: any = {}): Observable<ServerResponse<any>> {
    const options = {
      headers: new HttpHeaders({
        ...headers,
        'x-api-key': this.key
      }),
      params: new HttpParams({
        fromObject: params
      })
    };

    const endpoint = `https://${(stats ? 'stats' : 'www')}.bungie.net/Platform/`;
    return this.http.get<ServerResponse<any>>(endpoint + url, options);
  }
}
