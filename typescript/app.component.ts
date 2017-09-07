/**
 *  
 *  app.component.ts
 *  
 *  Copyleft 2016 Maarten De Schrijver
 *  <maarten de schrijver in the gmail domain dot com>
 *  
 */
 
import {Component}         from 'angular2/core';
import {JSONP_PROVIDERS, HTTP_PROVIDERS}  from 'angular2/http';
import {BDMDeliveryComponent} from './delivery-form.component'
import {DeliveryService} from './delivery.service';

@Component({
  selector: 'delivery-app',
  template: '<delivery-form></delivery-form>',
  directives: [BDMDeliveryComponent],
  providers:  [HTTP_PROVIDERS, DeliveryService]
})
export class AppComponent { }


/*
Copyright 2016 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/
