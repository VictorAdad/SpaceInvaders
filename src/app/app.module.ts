import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MaterialModule, MdNativeDateModule} from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import { LoginComponent } from '@components-app/login/login.component';
import { AppRoutingModule, routingComponents} from './app.routing';
import { PartialsModule, partialsComponents} from './partials.module';
import { NoticiaHechoModule, noticiaHechoComponents} from '@components-app/noticiaHecho/noticia-hecho.module';

import { MiservicioService} from "./services/miservicio.service";
import { AuthenticationService} from "@services/auth/authentication.service";

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    routingComponents,
    partialsComponents,
    noticiaHechoComponents
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
    MiservicioService,
    AuthenticationService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
