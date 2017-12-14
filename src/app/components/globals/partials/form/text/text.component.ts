import { Component, Input, Output, EventEmitter , OnInit, AfterViewInit, ViewChild, Renderer} from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { BaseInputComponent } from '../base-input.component';


@Component({
	selector    : 'text',
  	templateUrl : './text.component.html'
})
export class TextComponent extends BaseInputComponent {

	constructor(public renderer : Renderer){
		super(renderer)
	}

	ngOnInit(){
		if (this.group !=null && this.name != null && this.name != '') {
			this.control = this.group.get(this.name) as FormControl;
			this.control.valueChanges.subscribe(this.inputSlice.bind(this));
		}
	}

	ngAfterViewInit(){

	}

	update(value) {
		this.valueChange.emit(value);
		if(this.functionChange){
			this.functionChange(value);
		}
	}

	inputSlice(_value){
		if (_value!=null) {
			if(_value.toString().length > this.max)
				this.control.setValue(_value.toString().trim().slice(0,this.max));
			else if  ( _value.toString().length>0 && (/^\s*$/).test(_value) )
				this.control.setValue(_value.toString().trim());
		}
	}
}



