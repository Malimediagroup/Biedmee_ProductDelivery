/**
 *  
 *  delivery.service.ts
 *  
 *  Copyleft 2016 Maarten De Schrijver
 *  <maarten de schrijver in the gmail domain dot com>
 *  
 */
 
import {Injectable} from 'angular2/core';
import {Http, Response} from 'angular2/http';
import {Headers, RequestOptions} from 'angular2/http';
import {Jsonp} from 'angular2/http';
import {Observable}     from 'rxjs/Observable';

import { BdmDeliveryRequest, BdmAuction, BdmUser }    from './delivery';

@Injectable()
export class DeliveryService {
  
  constructor (private http: Http) {
    console.log('service constructed')
  }

  private _delUrl = 'http://leveringen.biedmee.be/echo';

  testSend(value: string): Observable<BdmDeliveryRequest> {

    let body = JSON.stringify({ value });
    console.log("body will be: " + body)
    let headers = new Headers({ 'Content-Type': 'application/json' });
    console.log(headers)
    let options = new RequestOptions({ headers: headers });
    console.log(options)
    console.log(this._delUrl)
  
    return this.http.post(this._delUrl, body, options)
                    .map(this.extractData)
                    .catch(this.handleError);
  }

  private extractData(res: Response) {
    console.log(res)
    if (res.status < 200 || res.status >= 300) {
      throw new Error('Bad response status: ' + res.status);
    }
    let body = res.text();
    return body.data || { };
  }

  private handleError(error: any) {
    console.log(error)
    // In a real world app, we might send the error to remote logging infrastructure
    let errMsg = error.message || 'Server error';
    console.error(errMsg); // log to console instead
    return Observable.throw(errMsg);
  }
}
