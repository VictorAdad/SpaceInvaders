import { Component, Input, Output, EventEmitter , OnInit} from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';


@Component({
	selector    : 'text-area',
  	templateUrl : './textarea.component.html'
})
export class TextareaComponent implements OnInit{
	@Input() label    : string;
	@Input() value    : string;
	@Input() name     : string  = '';
	@Input() group    : FormGroup = new FormGroup({});
	@Input() functionChange: Function;


	@Output() valueChange:EventEmitter<string> = new EventEmitter<String>();

	ngOnInit(){
		// console.log(this);
	}
	update(value) {
		this.valueChange.emit(value);
		if(this.functionChange){
			this.functionChange(value);
		}
	}
}



