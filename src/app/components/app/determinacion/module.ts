import { NgModule } from '@angular/core';
import { AcuerdoAcuerdoInicioComponent, DocumentoAcuerdoInicioComponent } from './acuerdo-inicio/component';
import { AcuerdosRadicacionComponent} from './acuerdo-radicacion/acuerdos-radicacion.component';
import { AcuerdoRadicacionCreateComponent,AcuerdoRadicacionComponent,DocumentoAcuerdoRadicacionComponent} from './acuerdo-radicacion/create/create.component';
import { FacultadesNoInvestigarComponent} from './facultad-no-investigar/facultades-no-investigar.component';
import { FacultadNoInvestigarCreateComponent,FacultadNoInvestigarComponent,DocumentoFacultadNoInvestigarComponent} from './facultad-no-investigar/create/create.component';
  

@NgModule()
export class DeterminacionModule { }

export const DeterminacionComponents = [
	AcuerdoAcuerdoInicioComponent,
    DocumentoAcuerdoInicioComponent,
    AcuerdosRadicacionComponent,
    AcuerdoRadicacionCreateComponent,
    AcuerdoRadicacionComponent,
    DocumentoAcuerdoRadicacionComponent,
    FacultadesNoInvestigarComponent,
    FacultadNoInvestigarCreateComponent,
    FacultadNoInvestigarComponent,
    DocumentoFacultadNoInvestigarComponent


];