import { NgModule } from '@angular/core';
import { DatosGeneralesComponent } from './datos-generales/component';
import { PersonaComponent } from './persona/component';
import { PersonaFisicaImputadoComponent } from './persona/create/persona-fisica-imputado.component';
import { IdentificacionComponent } from './persona/create/persona-fisica-imputado.component';
import { IdentidadComponent } from './persona/create/persona-fisica-imputado.component';
import { LocalizacionComponent } from './persona/create/persona-fisica-imputado.component';
import { MediaFilacionComponent } from './persona/create/persona-fisica-imputado.component';
import { DelitoComponent } from './delito/component';
import { TitularComponent, TransferirComponent } from './titular/component';
import {FormCreateDelitoComponent} from "@components-app/noticiaHecho/delito/create/formcreate.component"

@NgModule()
export class NoticiaHechoModule {}

export const noticiaHechoComponents = [
    DatosGeneralesComponent,
    PersonaComponent,
    PersonaFisicaImputadoComponent,
    IdentidadComponent,
    IdentificacionComponent,
    LocalizacionComponent,
    MediaFilacionComponent,
    DelitoComponent,
    TitularComponent,
    TransferirComponent,
    FormCreateDelitoComponent
];