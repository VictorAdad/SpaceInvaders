import { Component, Input, Output, EventEmitter } from '@angular/core';


@Component({
	selector    : 'date',
  	templateUrl : './date.component.html'
})
export class DateComponent{
	@Input() label : string = 'Seleccione una fecha';
	@Input() value : string;
}