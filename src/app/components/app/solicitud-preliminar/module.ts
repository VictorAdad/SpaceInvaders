import { NgModule } from '@angular/core';
import { AcuerdoGeneralComponent } from './acuerdo-general/component';
import { SolicitudAcuerdoGeneralComponent, DocumentoAcuerdoGeneralComponent } from './acuerdo-general/create/component';
import { SolicitudInspeccionComponent, DocumentoInspeccionComponent } from './inspeccion/create/component';
import { SolicitudPoliciaComponent, DocumentoPoliciaComponent } from './policia/create/component';

@NgModule()
export class SolicitudPreliminarModule { }

export const SolicitudPreliminarComponents = [
	AcuerdoGeneralComponent,
	SolicitudAcuerdoGeneralComponent,
    DocumentoAcuerdoGeneralComponent,
    SolicitudInspeccionComponent,
    DocumentoInspeccionComponent,
    SolicitudPoliciaComponent,
    DocumentoPoliciaComponent
];