import { NgModule } from '@angular/core';
import { AcuerdoGeneralComponent } from './acuerdo-general/component';
import { SolicitudAcuerdoGeneralComponent, DocumentoAcuerdoGeneralComponent } from './acuerdo-general/create/component';
import { SolicitudInspeccionComponent, DocumentoInspeccionComponent } from './inspeccion/create/component';
import { SolicitudRegistroGeneralComponent, DocumentoRegistroGeneralComponent } from './registro-general/create/component';
import { SolicitudPoliciaComponent, DocumentoPoliciaComponent } from './policia/create/component';
import { SolicitudPeritoComponent, DocumentoPeritoComponent } from './perito/create/component';
import { SolicitudRequerimientoInformacionComponent } from './requerimiento-informacion/create/component';
import { DocumentoRequerimientoInformacionComponent } from './requerimiento-informacion/create/component';


@NgModule()
export class SolicitudPreliminarModule { }

export const SolicitudPreliminarComponents = [
	AcuerdoGeneralComponent,
	SolicitudAcuerdoGeneralComponent,
    DocumentoAcuerdoGeneralComponent,
    SolicitudInspeccionComponent,
    DocumentoInspeccionComponent,
    DocumentoRegistroGeneralComponent,
	SolicitudRegistroGeneralComponent,
    SolicitudPoliciaComponent,
    DocumentoPoliciaComponent,
    SolicitudPeritoComponent,
    DocumentoPeritoComponent,
    SolicitudRequerimientoInformacionComponent,
    DocumentoRequerimientoInformacionComponent
];