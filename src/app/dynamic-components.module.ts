import { NgModule } from '@angular/core';
import { TransferirComponent } from '@components-app/noticiaHecho/titular/component';
import {FormCreateDelitoComponent} from "@components-app/noticiaHecho/delito/create/formcreate.component"
import {FormCreateDelitoCasoComponent} from "@components-app/noticiaHecho/datos-generales/formcreate.component"
import {SolPreDocComponent} from "@components-app/solicitud-preliminar/formatos"
import {ProgressDialog} from '@components-app/onLine/progressDialog.component';
import {savingComponent} from './directives/saving/saving.directive';
import { LoginDialog } from './components/app/onLine/loginDialog.component';
import { PersonaPreSaveComponent } from './components/app/noticiaHecho/persona/create/pre-save-component';
import { LoaderComponent } from './components/globals/partials/loader/component';
import { LoaderDialog } from './components/app/loader-dialog/component';

@NgModule()
export class DynamicComponentsModule {}

export const dyanamicComponents = [
    TransferirComponent,
    FormCreateDelitoComponent,
    FormCreateDelitoCasoComponent,
    SolPreDocComponent,
    PersonaPreSaveComponent,
    ProgressDialog,
    savingComponent,
    LoginDialog,
    LoaderComponent,
    LoaderDialog
];