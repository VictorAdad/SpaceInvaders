import { Component, Input, Output, EventEmitter} from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';


@Component({
	selector    : 'search',
  	templateUrl : './component.html'
})
export class SearchComponent {
	@Input() label    : string;
	@Input() value    : string;
	@Input() prefix   : string;
	@Input() sufix    : string;
	@Input() prefixIcon : string;
	@Input() sufixIcon  : string;
	@Input() name     : string  = '';
	@Input() required : boolean = false;
	@Input() group    : FormGroup = new FormGroup({});
	@Input() hintStart: string="";
	@Input() hintEnd: string="";


	@Output() valueChange:EventEmitter<string> = new EventEmitter<String>();

	update(value) {
		this.valueChange.emit(value);
	}
}



