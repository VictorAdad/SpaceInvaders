import { NgModule } from '@angular/core';
import { TransferirComponent } from '@components-app/noticiaHecho/titular/component';
import {FormCreateDelitoComponent} from "@components-app/noticiaHecho/delito/create/formcreate.component"

@NgModule()
export class DynamicComponentsModule {}

export const dyanamicComponents = [
    TransferirComponent,
    FormCreateDelitoComponent
];