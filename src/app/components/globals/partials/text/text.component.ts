import { Component, Input, Output, EventEmitter , OnInit} from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';


@Component({
	selector    : 'text',
  	templateUrl : './text.component.html'
})
export class TextComponent implements OnInit{
	@Input() label    : string;
	@Input() value    : string;
	@Input() prefix   : string;
	@Input() sufix    : string;
	@Input() name     : string  = '';
	@Input() required : boolean = false;
	@Input() group    : FormGroup = new FormGroup({});

	@Output() valueChange:EventEmitter<string> = new EventEmitter<String>();

	ngOnInit(){
		// console.log(this);
	}

	update(value) {
		this.valueChange.emit(value);
	}
}



