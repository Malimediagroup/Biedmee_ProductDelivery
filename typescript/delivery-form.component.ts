/**
 *  
 *  delivery-form.component.ts
 *  
 *  Copyleft 2016 Maarten De Schrijver
 *  <maarten de schrijver in the gmail domain dot com>
 *  
 */

import {Component} from 'angular2/core';
import {FORM_DIRECTIVES}    from 'angular2/common';
import { BdmDeliveryRequest, BdmAuction, BdmUser }    from './delivery';
import {JSONP_PROVIDERS, Http, Jsonp, Headers, RequestOptions} from 'angular2/http';
import {Observable}       from 'rxjs/Observable';
import {DeliveryService} from './delivery.service';

@Component({
  selector: 'delivery-form',
  directives: [FORM_DIRECTIVES],
  templateUrl: 'app/delivery-form.component.html'
})
export class BDMDeliveryComponent {
  
  constructor (
    private _deliveryService: DeliveryService,
    private _http: Http
  ) {}

  // Reset the form and restore 'pristine' class state
  // by toggling 'active' flag which causes the form
  // to be removed/re-added in a tick via NgIf
  // TODO: Workaround until NgForm has a reset method (#6822)
  active = true;

  // TODO: change in production to 'http://leveringen.biedmee.be/create'
  //~ endpoint = 'http://delivery.biedmee.be.local/create';
  endpoint = 'http://leveringen.biedmee.be/create';
  
  errorMsg: string;
  resultMsg: Object;
  
  // Two-stage form : init both states to false (ie., show form)
  confirmed = false;
  submitted = false;
  completed = false;
  is_company = true;

  allCountries = [
    { code: 'BE', name: 'België' },
    { code: 'NL', name: 'Nederland' },
  ]

  countries = ['België', 'Nederland'];
  residenceTypes = [
    { key: 'home', value: 'Thuisadres'}, 
    { key: 'work', value: 'Bedrijfsadres'}, 
  ];

  user = new BdmUser(
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    this.countries[0],
    this.residenceTypes[0].key,
  );
  auction = new BdmAuction('', '');
              
  model = new BdmDeliveryRequest(
    [this.auction],
    this.user,
    '');

  addAuction() {
      this.model.auctions.push(new BdmAuction('', ''));
  }

  removeAuction() {
      this.model.auctions.pop();
      // Temporary pseudo solution here
      this.active = false;
      setTimeout(()=> this.active=true, 0);
  }
  
  previewDelivery() { this.confirmed = true; }
  
  onSubmit() {
    console.log('onSubmit');
    this.submitted = true;
    let json_body = JSON.stringify(this.model);
    console.log(json_body);
    let headers = new Headers({
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
    });
    let options = new RequestOptions({ headers: headers });
    this._http.post(this.endpoint, json_body, options)
      .map(res => res.json())
      .subscribe(
        data => this.resultMsg = data,
        error => this.errorMsg = <any>error,
        () => this.complete = true
      );
    //this._deliveryService.testSend(value)
    //                 .subscribe(
    //                   data => this.resultMsg = data,
    //                   error =>  this.errorMsg = <any>error);
  }
  
  sendDelivery() {
    console.log('sendDelivery');
    this.submitted = true;
    let json_body = JSON.stringify(this.model);
    console.log(json_body);
    let headers = new Headers({
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
    });
    let options = new RequestOptions({ headers: headers });
    this._http.post(this.endpoint, json_body, options)
      .map(res => res.json())
      .subscribe(
        data => this.resultMsg = data,
        error => this.errorMsg = <any>error,
        () => this.complete = true
      );
    //this._deliveryService.testSend(value)
    //                 .subscribe(
    //                   data => this.resultMsg = data,
    //                   error =>  this.errorMsg = <any>error);
  }

  // TODO: Remove this when we're done
  get diagnostic() { return JSON.stringify(this.model); }

  reset() {
    this.model = new BdmDeliveryRequest(
      [this.auction],
      this.user, 0, '');
      // Temporary pseudo solution here
    this.active = false;
    setTimeout(()=> this.active=true, 0);
  }
  //////// NOT SHOWN IN DOCS ////////

  // Reveal in html:
  //   Name via form.controls = {{showFormControls(deliveryForm)}}
  showFormControls(form:NgForm){

    return form && form.controls['auctionName'] &&
    form.controls['auctionName'].value;
  }

}
