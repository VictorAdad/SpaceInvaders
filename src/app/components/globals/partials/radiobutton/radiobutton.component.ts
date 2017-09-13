import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

@Component({
	selector    : 'radiobutton',
  	templateUrl : './radiobutton.component.html'
})
export class RadioButtonComponent{
	@Input() radios: MRadioButton[] = [];
	@Input() value: any;
	@Input() class: string;
	@Input() name     : string  = '';
	@Input() required : boolean = false;
	@Input() group    : FormGroup = new FormGroup({});
	@Input() functionChange: Function;

	@Output() valueChange:EventEmitter<string> = new EventEmitter<String>()

	//TODO: Falta ver como sincronizar los cambios los radio.
	update(value) {
		this.valueChange.emit(value);
		if(this.functionChange){
			this.functionChange(value);
		}
	}
}

export class MRadioButton{
	value: string;
	label: string;
}