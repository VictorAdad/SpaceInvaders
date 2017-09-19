import { NgModule } from '@angular/core';
import { TextComponent } from '@partials/form/text/text.component';
import { CheckboxComponent } from '@partials/form/checkbox/checkbox.component';
import { DateComponent } from '@partials/form/date/date.component';
import { TextareaComponent } from '@partials/form/textarea/textarea.component';
import { RadioButtonComponent} from '@partials/form/radiobutton/radiobutton.component';
import { Select2Component } from '@partials/form/select2/select2.component';
import { TokenInputComponent } from '@partials/form/tokeninput/tokeninput.component'
import { BreadcrumbComponent } from '@partials/breadcrumb/breadcrumb.component'



@NgModule()
export class PartialsModule {}

export const partialsComponents = [
	TextComponent,
	CheckboxComponent,
	DateComponent,
	TextareaComponent,
	RadioButtonComponent,
	TokenInputComponent,
	Select2Component,
	BreadcrumbComponent
];
