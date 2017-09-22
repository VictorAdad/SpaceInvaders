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
import { DynamicComponentsModule, dyanamicComponents} from './dynamic-components.module';
import { NoticiaHechoModule, noticiaHechoComponents} from '@components-app/noticiaHecho/module';
import { SolicitudPreliminarModule, SolicitudPreliminarComponents } from '@components-app/solicitud-preliminar/module';
import { PredenunciaComponent, DocumentoPredenunciaComponent, PredenunciaCreateComponent,} from '@components-app/predenuncia/create/create.component';

import { FileUploadModule } from 'ng2-file-upload';
import { DeterminacionModule, DeterminacionComponents } from '@components-app/determinacion/module';
import { MomentModule } from 'angular2-moment';
import { EntrevistaModule, EntrevistaComponents } from '@components-app/entrevista/module';

import { MiservicioService} from "./services/miservicio.service";
import { AuthenticationService} from "@services/auth/authentication.service";
import { GlobalService } from "@services/global.service";
import { OnLineService } from "@services/onLine.service";
import { CIndexedDB } from '@services/indexedDB';
import { JasperoConfirmationsModule } from '@jaspero/ng2-confirmations';


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
    DeterminacionComponents,

    PredenunciaComponent, 
    DocumentoPredenunciaComponent, 
    PredenunciaCreateComponent,

    EntrevistaComponents
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
    NoticiaHechoModule,
    SolicitudPreliminarModule,
    DeterminacionModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    FileUploadModule,
    MomentModule,
    EntrevistaModule,
    JasperoConfirmationsModule
  ],
  providers: [
    MiservicioService,
    AuthenticationService,
    GlobalService,
    OnLineService,
    CIndexedDB
  ],
  entryComponents: [
    dyanamicComponents
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
