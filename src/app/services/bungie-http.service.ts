import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ServerResponse } from 'bungie-api-ts/common';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BungieHttpService {
  private _origin: string;
  private _apiKey: string;
  public error: BehaviorSubject<ServerResponse<any>>;

  constructor(private http: HttpClient) {
    this.error = new BehaviorSubject(null);
    this._origin = window.location.protocol + '//' + window.location.hostname;
    switch (this._origin) {
      case 'http://dev.glory.report':
        this._apiKey = 'ecc34e9250b34803ae6e09405568df82';
        break;

      case 'https://glory.report':
        this._apiKey = '';
        break;
    }
  }

  get(url): Observable<ServerResponse<any>> {
    const httpOptions = {
      headers: new HttpHeaders({
        'x-api-key': this._apiKey
      })
    };

    return this.http.get<ServerResponse<any>>(url, httpOptions);
  }
}
