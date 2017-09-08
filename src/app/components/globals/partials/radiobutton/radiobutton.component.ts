import { Component, Input, Output, EventEmitter } from '@angular/core';


@Component({
	selector    : 'radiobuttongroup',
  	templateUrl : './radiobutton.component.html'
})
export class RadioButton{
	@Input() radios: MRadioButton[] = [];
	@Input() value: any;

	@Output() valueChange:EventEmitter<string> = new EventEmitter<String>()

	//TODO: Falta ver como sincronizar los cambios los radio.
	update(value) {
		this.valueChange.emit(value);
		console.log(value);
	}
}

export class MRadioButton{
	value: string;
	label: string;
}