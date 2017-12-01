import { Component, Input, Output, EventEmitter , OnInit, AfterViewInit, ViewChild, Renderer} from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { BaseInputComponent } from '../base-input.component';


@Component({
	selector    : 'text',
  	templateUrl : './text.component.html'
})
export class TextComponent extends BaseInputComponent {

	public control : FormControl;

	constructor(public renderer : Renderer){
		super(renderer)
	}

	ngOnInit(){
		this.control = this.group.get(this.name) as FormControl;
		this.control.valueChanges.subscribe(this.inputSlice.bind(this));
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
		if (_value!=null && _value.toString().length > this.max) {
			this.control.setValue(_value.toString().slice(0,this.max));
		}

	}
}



