import { NgModule } from '@angular/core';
import { TextComponent } from '@partials/form/text/text.component';
import { CheckboxComponent } from '@partials/form/checkbox/checkbox.component';
import { DateComponent } from '@partials/form/date/date.component';
import { TextareaComponent } from '@partials/form/textarea/textarea.component';
import { RadioButtonComponent} from '@partials/form/radiobutton/radiobutton.component';
import { Select2Component } from '@partials/form/select2/select2.component';
import { TokenInputComponent } from '@partials/form/tokeninput/tokeninput.component';
import { BreadcrumbComponent } from '@partials/breadcrumb/breadcrumb.component';
import { TimeComponent } from '@partials/form/time/time.component';
import { NumberComponent } from '@partials/form/number/component';
import { PasswordComponent } from '@partials/form/password/component';
import { LoaderComponent } from '@partials/loader/component';
import { CasoNicComponent } from '@partials/caso/component';
import { SlideToggleComponent} from '@partials/form/slide-toggle/slide-toggle.component';
import { EmailComponent } from '@partials/form/email/email.component';


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
	BreadcrumbComponent,
	TimeComponent,
	PasswordComponent,
	LoaderComponent,
	CasoNicComponent,
  NumberComponent,
  SlideToggleComponent,
  EmailComponent
];
