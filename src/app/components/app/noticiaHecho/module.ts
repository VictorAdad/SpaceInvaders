import { NgModule } from '@angular/core';
import { DatosGeneralesComponent } from './datos-generales/component';
import { PersonaComponent } from './persona/component';
import { DelitoComponent } from './delito/component';

export class NoticiaHechoModule {}

export const noticiaHechoComponents = [
    DatosGeneralesComponent,
    PersonaComponent,
    DelitoComponent
];