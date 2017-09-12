import { NgModule } from '@angular/core';
import { TextComponent } from '@partials/text/text.component';
import { CheckboxComponent } from '@partials/checkbox/checkbox.component';
import { DateComponent } from '@partials/date/date.component';
import { TextareaComponent } from '@partials/textarea/textarea.component';
import { RadioButtonComponent} from '@partials/radiobutton/radiobutton.component';
import { Select2Component } from '@partials/select2/select2.component';
import { BreadCrumbComponent } from '@partials/breadcrumb/breadcrumb.component';
import { TokenInputComponent } from '@partials/tokeninput/tokeninput.component'


@NgModule()
export class PartialsModule {}

export const partialsComponents = [
	TextComponent,
	CheckboxComponent,
	DateComponent,
	TextareaComponent,
	RadioButtonComponent,
	TokenInputComponent,
	Select2Component
];

