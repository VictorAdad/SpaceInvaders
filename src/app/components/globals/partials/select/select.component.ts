import { Component, Input, Output, EventEmitter } from '@angular/core';


@Component({
	selector    : 'selectcomponent',
  	templateUrl : './select.component.html'
})
export class Select{
	@Input() options: MOption[] = [];
	@Input() value: any;
	@Input() placeholder: string;

	@Output() valueChange:EventEmitter<string> = new EventEmitter<String>()

	//TODO: Falta ver como sincronizar los cambios los radio.
	update(value) {
		this.valueChange.emit(value);
	}
}

export class MOption{
	value: string;
	label: string;
}