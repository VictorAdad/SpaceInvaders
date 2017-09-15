import { NgModule } from '@angular/core';
import { SolicitudAcuerdoGeneralComponent, DocumentoAcuerdoGeneralComponent } from './acuerdo-general/component';

@NgModule()
export class SolicitudPreliminarModule { }

export const SolicitudPreliminarComponents = [
	SolicitudAcuerdoGeneralComponent,
    DocumentoAcuerdoGeneralComponent
];