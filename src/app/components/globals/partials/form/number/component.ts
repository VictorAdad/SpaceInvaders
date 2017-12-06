import { Component, Input, Output, EventEmitter , OnInit, AfterViewInit, ViewChild, Renderer} from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { BaseInputComponent } from '../base-input.component';
import { Logger } from "@services/logger.service";

@Component({
	selector    : 'number',
  	templateUrl : './component.html'
})

export class NumberComponent extends BaseInputComponent {

	@Input() max :number = 20;

	public regexDEC: RegExp = /^[0-9.]*$/;
	// /^[0-9]*\.[0-9]{2}$/

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
		Logger.log('--------------->',this.backupValue, _value)
		if (_value != null && _value != "") {
			if (!this.regexDEC.test(_value)){
				this.control.setValue(this.backupValue);
			}else{
				this.backupValue = _value;
			}

			if (_value.toString().length > this.max)
				this.control.setValue(_value.toString().slice(0,this.max));
		}else {
			this.backupValue = _value;
		}
	}
}




