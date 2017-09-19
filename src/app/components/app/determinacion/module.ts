import { NgModule } from '@angular/core';
import { AcuerdoAcuerdoInicioComponent, DocumentoAcuerdoInicioComponent } from './acuerdo-inicio/component';
import { AcuerdosRadicacionComponent} from './acuerdo-radicacion/acuerdos-radicacion.component';
import { AcuerdoRadicacionCreateComponent,AcuerdoRadicacionComponent,DocumentoAcuerdoRadicacionComponent} from './acuerdo-radicacion/create/create.component';
  
import { DeterminacionArchivoTemporalComponent, DocumentoArchivoTemporalComponent } from './archivo-temporal/create/component';
import { DeterminacionNoEjercicioAccionPenalComponent, DocumentoNoEjercicioAccionPenalComponent } from './no-ejercicio-accion-penal/create/component';

@NgModule()
export class DeterminacionModule { }

export const DeterminacionComponents = [
	AcuerdoAcuerdoInicioComponent,
    DocumentoAcuerdoInicioComponent,
    AcuerdosRadicacionComponent,
    AcuerdoRadicacionCreateComponent,
    AcuerdoRadicacionComponent,
    DocumentoAcuerdoRadicacionComponent,
    DeterminacionArchivoTemporalComponent,
    DocumentoArchivoTemporalComponent,
    DeterminacionNoEjercicioAccionPenalComponent,
    DocumentoNoEjercicioAccionPenalComponent
];