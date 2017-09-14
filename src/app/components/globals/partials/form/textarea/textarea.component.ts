import { Component, Input, Output, EventEmitter } from '@angular/core';


@Component({
	selector    : 'text-area',
  	templateUrl : './textarea.component.html'
})
export class TextareaComponent{
	@Input() label : string;
	@Input() value : string;

	@Output() valueChange:EventEmitter<string> = new EventEmitter<String>()

	update(value) {
		this.valueChange.emit(value);
	}
}



