import { Component, Input, Output, EventEmitter , OnInit, Renderer} from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { TextComponent } from '../text/text.component';


@Component({
	selector    : 'password',
  	templateUrl : './component.html'
})
export class PasswordComponent extends TextComponent{

	constructor(renderer : Renderer){
		super(renderer)
	}
}



