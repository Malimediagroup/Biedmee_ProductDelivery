/**
 *  
 *  main.ts
 *  
 *  Copyleft 2016 Maarten De Schrijver
 *  <maarten de schrijver in the gmail domain dot com>
 *  
 */
 
import {bootstrap}          from 'angular2/platform/browser';
import {enableProdMode}     from 'angular2/core'
import { HTTP_PROVIDERS }   from 'angular2/http';

// Add all operators to Observable
import 'rxjs/add/operator/map';

import {AppComponent} from './app.component';

// TODO: enable in production
enableProdMode();

bootstrap(AppComponent,
          [HTTP_PROVIDERS]
);
