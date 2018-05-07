import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

/*
  Generated class for the TrafficLightSystemProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class TrafficLightSystemProvider {

  constructor() {
  }

  switchLight(color: string): Observable<any> {
    let response = {
      ok: true,
      message: `May change to color ${color}.`
    };
    return Observable.of(response).delay(1500);
  }
}
