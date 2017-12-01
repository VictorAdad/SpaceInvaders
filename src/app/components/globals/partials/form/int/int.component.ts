import { Component, Input, Output, EventEmitter , OnInit, AfterViewInit, ViewChild, Renderer} from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { BaseInputComponent } from '../base-input.component';

@Component({
	selector    : 'int',
  	templateUrl : './int.component.html'
})

export class IntComponent extends BaseInputComponent {

	@Input() max :number = 12;

	public regexINT: RegExp = /^\d+$/;

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
		if (_value!=null) {
			if (!this.regexINT.test(_value)){
				this.control.setValue(this.backupValue);
			}else{
				this.backupValue = _value;
			}

			if (_value.toString().length > this.max)
				this.control.setValue(_value.toString().slice(0,this.max));
		}
	}
}