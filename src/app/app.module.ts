import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MaterialModule, MdNativeDateModule} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import { LoginComponent } from '@components-app/login/login.component';
import { AppRoutingModule, routingComponents} from './app.routing';
import { PartialsModule, partialsComponents} from './partials.module';
import { DirectivesModule, directivesComponents} from './directives.module';
import { CustomModule, customComponents} from './custom.module';
import { NoticiaHechoModule, noticiaHechoComponents} from '@components-app/noticiaHecho/module';
import { SolicitudPreliminarModule, SolicitudPreliminarComponents } from '@components-app/solicitud-preliminar/module';
import { DeterminacionModule, DeterminacionComponents } from '@components-app/determinacion/module';

import { MiservicioService} from "./services/miservicio.service";
import { AuthenticationService} from "@services/auth/authentication.service";
import { GlobalService } from "@services/global.service";

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    routingComponents,
    partialsComponents,
    noticiaHechoComponents,
    directivesComponents,
    customComponents,
    SolicitudPreliminarComponents,
    DeterminacionComponents
  ],
  imports: [
    BrowserModule,
    MaterialModule,
    MdNativeDateModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    PartialsModule,
    DirectivesModule,
    CustomModule,
    SolicitudPreliminarModule,
    DeterminacionModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    MiservicioService,
    AuthenticationService,
    GlobalService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
