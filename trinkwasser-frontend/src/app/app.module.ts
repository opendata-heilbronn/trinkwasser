import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {ZoneSelectorComponent} from './zone-selector/zone-selector.component';
import {HttpClientModule} from "@angular/common/http";
import {FormsModule} from "@angular/forms";
import { ZoneDetailsComponent } from './zone-details/zone-details.component';
import { MeasurementComponent } from './measurement/measurement.component';

@NgModule({
  declarations: [
    AppComponent,
    ZoneSelectorComponent,
    ZoneDetailsComponent,
    MeasurementComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
