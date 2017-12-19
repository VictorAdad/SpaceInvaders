import { Component, Input, Output, EventEmitter , OnInit, AfterViewInit, ViewChild, Renderer} from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { BaseInputComponent } from '../base-input.component';

@Component({
	selector    : 'int',
  	templateUrl : './int.component.html'
})

export class IntComponent extends BaseInputComponent {

	@Input() max :number = 12;
	@Input() min :number = null;

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
		if (_value && _value != '') {
			if (!this.regexINT.test(_value)){
        this.control.setValue(this.backupValue);
        console.log('Sttting previos',this.backupValue)
			}else{
				this.backupValue = _value;
			}

			if (_value.toString().length > this.max)
				this.control.setValue(_value.toString().slice(0,this.max));
			if (this.min && this.control.value.toString().length < this.min){
        this.invalid();
			}else{
        console.log('seting valid',this.backupValue)

				this.valid();
			}
		}else{
			this.backupValue = _value;
			if (!_value){
				console.log("Valor");
				this.valid();
			}
		}
	}

	public valid(){
		this.hintEnd = ""
		if (this.value)
			this.control.setErrors(null);
	}

	public invalid(){
		this.hintEnd = "Este campo no es valido se requeiren "+this.min+" caracteres";
		this.control.setErrors({'incorrect': true});
	}
}
