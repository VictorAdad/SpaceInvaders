import { Component, Input, Output, EventEmitter } from '@angular/core';


@Component({
	selector    : 'text',
  	templateUrl : './text.component.html'
})
export class TextComponent{
	@Input() label : string;
	@Input() value : string;

	@Output() valueChange:EventEmitter<string> = new EventEmitter<String>()

	update(value) {
		this.valueChange.emit(value);
	}
}



