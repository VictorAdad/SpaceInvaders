import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
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
import { CatalogosModule, catalogosComponents } from '@components-app/catalogos/module';

import { FileUploadModule } from 'ng2-file-upload';
import { DeterminacionModule, DeterminacionComponents } from '@components-app/determinacion/module';
import { MomentModule } from 'angular2-moment';
import { EntrevistaModule, EntrevistaComponents } from '@components-app/entrevista/module';

import { MiservicioService} from "./services/miservicio.service";
import { AuthenticationService} from "@services/auth/authentication.service";
import { GlobalService } from "@services/global.service";
import { OnLineService } from "@services/onLine.service";
import { CIndexedDB } from '@services/indexedDB';
import { HttpService } from '@services/http.service';
import { SelectsService } from '@services/selects.service';
import { NoticiaHechoService } from '@services/noticia-hecho.service';
import { LugarService } from '@services/noticia-hecho/lugar.service';
import { VehiculoService } from '@services/noticia-hecho/vehiculo/vehiculo.service';
import { ArmaService } from '@services/noticia-hecho/arma/arma.service';
import { PersonaService } from '@services/noticia-hecho/persona/persona.service';
import { JasperoConfirmationsModule } from '@jaspero/ng2-confirmations';

import { MdNativeDateModule, MdIconModule} from '@angular/material';
import {MdMenuModule} from '@angular/material';
import {MdPaginatorModule} from '@angular/material';
import {MdTableModule} from '@angular/material';
import {MdExpansionModule} from '@angular/material';
import {MdDatepickerModule} from '@angular/material';
import {MdRadioModule} from '@angular/material';
import {MdAutocompleteModule} from '@angular/material';
import {MdSelectModule} from '@angular/material';
import {MdTooltipModule} from '@angular/material';
import {MdSnackBarModule} from '@angular/material';
import {MdToolbarModule} from '@angular/material';
import {MdListModule} from '@angular/material';
import {MdCardModule} from '@angular/material';
import {MdTabsModule} from '@angular/material';
import {MdButtonModule} from '@angular/material';
import {MdInputModule} from '@angular/material';
import {MatCheckboxModule} from '@angular/material';
// import { MaterialModule} from '@angular/material';

import { AgmCoreModule } from '@agm/core';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    routingComponents,
    partialsComponents,
    noticiaHechoComponents,
    directivesComponents,
    customComponents,
    dyanamicComponents,
    SolicitudPreliminarComponents,
    DeterminacionComponents,

    PredenunciaComponent, 
    DocumentoPredenunciaComponent, 
    PredenunciaCreateComponent,

    EntrevistaComponents,

    catalogosComponents
  ],
  imports: [
    BrowserModule,
    MdNativeDateModule,
    MdIconModule,
    MdMenuModule,
    MdPaginatorModule,
    MdTableModule,
    MdExpansionModule,
    MdDatepickerModule,
    MdRadioModule,
    MdAutocompleteModule,
    MdSelectModule,
    MdTooltipModule,
    MdSnackBarModule,
    MdToolbarModule,
    MdListModule,
    MdCardModule,
    MdTabsModule,
    MdButtonModule,
    MdInputModule,
    MatCheckboxModule,
    // MaterialModule,
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
    JasperoConfirmationsModule,

    CatalogosModule,

    AgmCoreModule.forRoot({
        apiKey: 'AIzaSyC3cI1aBJ-gr-305dfFHLMV5yO9Qw_Tl8M',
        libraries: ["places"]
    })
  ],
  providers: [
    MiservicioService,
    AuthenticationService,
    GlobalService,
    OnLineService,
    CIndexedDB,
    HttpService,
    SelectsService,
    NoticiaHechoService,
    LugarService,
    VehiculoService,
    PersonaService,
    ArmaService
  ],
  entryComponents: [
    dyanamicComponents
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
