import { NgModule } from '@angular/core';
import { TextComponent } from '@partials/text/text.component';
import { CheckboxComponent } from '@partials/checkbox/checkbox.component';
import { DateComponent } from '@partials/date/date.component';
import { TextareaComponent } from '@partials/textarea/textarea.component';


@NgModule()
export class PartialsModule {}

export const partialsComponents = [
	TextComponent,
	CheckboxComponent,
	DateComponent,
	TextareaComponent
];

