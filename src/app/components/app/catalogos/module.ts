import { NgModule } from '@angular/core';
import { CatalogoArmasComponent } from './armas/component';
import { municipioCatalogosComponent } from './municipios/component';
import {municipioCreateComponent} from'./municipios/create/create.component'
@NgModule()
export class CatalogosModule {}

export const catalogosComponents = [
    CatalogoArmasComponent,
    municipioCatalogosComponent,
    municipioCreateComponent
]
