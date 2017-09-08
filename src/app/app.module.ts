import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MaterialModule, MdNativeDateModule} from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import { AppRoutingModule, routingComponents} from './app.routing';
import { PartialsModule, partialsComponents} from './partials.module';

import { MiservicioService} from "./services/miservicio.service";

@NgModule({
  declarations: [
    AppComponent,
    routingComponents,
    partialsComponents
  ],
  imports: [
    BrowserModule,
    MaterialModule,
    MdNativeDateModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    PartialsModule,
    HttpModule,
    FormsModule
  ],
  providers: [
  MiservicioService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
