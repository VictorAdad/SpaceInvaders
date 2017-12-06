import { Component, Input, Output, EventEmitter, Renderer, ViewChild} from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Logger } from "@services/logger.service";


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

	@Output() valueChange:EventEmitter<string> = new EventEmitter<string>();

	@Output() search:EventEmitter<string> = new EventEmitter<string>();

	@ViewChild('input') input;

	public empty: boolean = true;

	constructor(private renderer: Renderer){

	}

	ngAfterViewInit(){
		this.renderer.listen(
			this.input.nativeElement, 'keyup', this.filter.bind(this));
	}

	public filter(_event){
		let input = this.input.nativeElement;
		this.empty = input.value.length == 0;

		if(_event.code == 'Enter')
			this.search.emit(input.value);
	}

	public clean(){
		let input   = this.input.nativeElement;
		input.value = '';
		this.empty  = true;
		this.search.emit('');
	}

	update(value) {
		this.valueChange.emit(value);
	}
}



