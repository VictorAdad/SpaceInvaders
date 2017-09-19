import { NgModule } from '@angular/core';
import { DatosGeneralesComponent } from './datos-generales/component';
import { PersonaComponent } from './persona/component';
import { DelitoComponent } from './delito/component';
import { TitularComponent, TransferirComponent } from './titular/component';
import {FormCreateDelitoComponent} from "@components-app/noticiaHecho/delito/create/formcreate.component"

@NgModule()
export class NoticiaHechoModule {}

export const noticiaHechoComponents = [
    DatosGeneralesComponent,
    PersonaComponent,
    DelitoComponent,
    TitularComponent,
    TransferirComponent,
    FormCreateDelitoComponent
];