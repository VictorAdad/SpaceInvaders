import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';


@Component({
	selector    : 'date',
  	templateUrl : './date.component.html'
})
export class DateComponent{
	@Input() label : string = 'Seleccione una fecha';
	@Input() value : string;
	@Input() name  : string  = '';
  @Input() group : FormGroup = new FormGroup({});
  @Input() disabled: boolean=false;
	@Output() valueChange:EventEmitter<string> = new EventEmitter<String>();
	update(value) {
		this.valueChange.emit(value);
	}
}
