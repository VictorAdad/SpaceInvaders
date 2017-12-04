import { Component, Input, Output, EventEmitter , OnInit, AfterViewInit, ViewChild, Renderer} from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { BaseInputComponent } from '../base-input.component';

@Component({
	selector    : 'phone',
  	templateUrl : './phone.component.html'
})

export class PhoneComponent extends BaseInputComponent {

	@Input() max :number = 20;

	public regexPHONE: RegExp = /^[0-9()-\s]*$/;

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
		console.log('--------------->',this.backupValue, _value)
		if (_value != null && _value != "") {
			if (!this.regexPHONE.test(_value)){
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