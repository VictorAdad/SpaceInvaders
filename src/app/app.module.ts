import {MATERIAL_COMPATIBILITY_MODE, MAT_DATE_LOCALE} from '@angular/material';
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
import { DialogSincrinizarService} from "@services/onLine/dialogSincronizar.service";
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
import { FormatosService } from '@services/formatos/formatos.service';
import { CasoService } from '@services/caso/caso.service';
import { NotifyService } from '@services/notify/notify.service';
import { JasperoConfirmationsModule } from '@jaspero/ng2-confirmations';

import { MatNativeDateModule, MatIconModule} from '@angular/material';
import {MatMenuModule} from '@angular/material';
import {MatPaginatorModule} from '@angular/material';
import {MatTableModule} from '@angular/material';
import {MatExpansionModule} from '@angular/material';
import {MatDatepickerModule} from '@angular/material';
import {MatRadioModule} from '@angular/material';
import {MatAutocompleteModule} from '@angular/material';
import {MatSelectModule} from '@angular/material';
import {MatTooltipModule} from '@angular/material';
import {MatSnackBarModule} from '@angular/material';
import {MatToolbarModule} from '@angular/material';
import {MatListModule} from '@angular/material';
import {MatCardModule} from '@angular/material';
import {MatTabsModule} from '@angular/material';
import {MatButtonModule} from '@angular/material';
import {MatInputModule} from '@angular/material';
import {MatCheckboxModule} from '@angular/material';
import {MatProgressBarModule} from '@angular/material';
import {MatProgressSpinnerModule} from '@angular/material';
import {MatPaginatorIntl} from '@angular/material';
import { SimpleNotificationsModule } from 'angular2-notifications';
import {MatSlideToggleModule} from '@angular/material';
import {VgCoreModule} from 'videogular2/core';
import {VgControlsModule} from 'videogular2/controls';
import {VgOverlayPlayModule} from 'videogular2/overlay-play';
import {VgBufferingModule} from 'videogular2/buffering';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';

// import { MaterialModule} from '@angular/material';

import { AgmCoreModule } from '@agm/core';
import {Logger} from '@services/logger.service';
import { MatPaginatorIntlEsp } from '@providers/paginator.provider';
import 'hammerjs';
import { pipes } from './pipes/pipe.module';
import { LoginDialogService } from './services/onLine/loginDialog.service';

//Informe Homologado
import { PrincipalInformeHomologadoCreate} from '@components-app/informe-homologado/principal/principal.component';
import { Anexo1Component} from '@components-app/informe-homologado/anexo1/anexo1.component';
import { Anexo2Component} from '@components-app/informe-homologado/anexo2/anexo2.component';
import { Anexo3Component} from '@components-app/informe-homologado/anexo3/anexo3.component';
import { Anexo4Component} from '@components-app/informe-homologado/anexo4/anexo4.component';
import { Anexo5Component} from '@components-app/informe-homologado/anexo5/anexo5.component';
import { Anexo6Component} from '@components-app/informe-homologado/anexo6/anexo6.component';
import { Anexo7Component} from '@components-app/informe-homologado/anexo7/anexo7.component';
import { Anexo8Component} from '@components-app/informe-homologado/anexo8/anexo8.component';
import { Anexo9Component} from '@components-app/informe-homologado/anexo9/anexo9.component';

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
    PrincipalInformeHomologadoCreate,
    Anexo1Component,
    Anexo2Component,
    Anexo3Component,
    Anexo4Component,
    Anexo5Component,
    Anexo6Component,
    Anexo7Component,
    Anexo8Component,
    Anexo9Component,
    EntrevistaComponents,

    catalogosComponents,
    pipes,
  ],
  imports: [
    BrowserModule,
    MatNativeDateModule,
    MatIconModule,
    MatMenuModule,
    MatPaginatorModule,
    MatTableModule,
    MatExpansionModule,
    MatDatepickerModule,
    MatRadioModule,
    MatRadioModule,
    MatAutocompleteModule,
    MatSelectModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatToolbarModule,
    MatListModule,
    MatCardModule,
    MatTabsModule,
    MatButtonModule,
    MatInputModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
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
    SimpleNotificationsModule,
    VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule,
    NgIdleKeepaliveModule.forRoot(),
    CatalogosModule,

    AgmCoreModule.forRoot({
        apiKey: 'AIzaSyC3cI1aBJ-gr-305dfFHLMV5yO9Qw_Tl8M',
        libraries: ["places"]
    })
  ],
  providers: [
    DialogSincrinizarService,
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
    ArmaService,
    FormatosService,
    CasoService,
    NotifyService,
    Logger,
    LoginDialogService,
    {provide: MATERIAL_COMPATIBILITY_MODE, useValue: true},
    {provide: MAT_DATE_LOCALE, useValue: 'es-MX'},
    {provide: MatPaginatorIntl, useClass: MatPaginatorIntlEsp},
    pipes,

  ],
  entryComponents: [
    dyanamicComponents
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
