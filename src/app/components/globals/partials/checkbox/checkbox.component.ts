import { Component, Input, Output, EventEmitter } from '@angular/core';


@Component({
	selector    : 'checkbox',
  	templateUrl : './checkbox.component.html'
})
export class CheckboxComponent{
	@Input() label : string;
	@Input() value : string;

	@Output() valueChange:EventEmitter<string> = new EventEmitter<String>()

	update(value) {
		this.valueChange.emit(value);
	}
}



