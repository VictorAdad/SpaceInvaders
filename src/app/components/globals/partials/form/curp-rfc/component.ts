import { Component, Input, Output, EventEmitter , OnInit, AfterViewInit, ViewChild} from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { BaseInputComponent } from '../base-input.component';
import { Logger } from "@services/logger.service";


@Component({
	selector    : 'curp-rfc',
  	templateUrl : './component.html'
})
export class CurpRfcComponent extends BaseInputComponent implements OnInit{

	@Input() max: number = 18;

	@Input() curp : boolean = true;

	public regexCURP: RegExp = /^[A-Z]{1}[AEIOU]{1}[A-Z]{2}[0-9]{2}(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1])[HM]{1}(AS|BC|BS|CC|CS|CH|CL|CM|DF|DG|GT|GR|HG|JC|MC|MN|MS|NT|NL|OC|PL|QT|QR|SP|SL|SR|TC|TS|TL|VZ|YN|ZS|NE)[B-DF-HJ-NP-TV-Z]{3}[0-9A-Z]{1}[0-9]{1}$/;

	public regexRFC: RegExp = /^[A-Z,Ñ,&]{3,4}([0-9]{2})(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1])[A-Z|\d]{3}$/;

	public regexRFC10: RegExp = /^[A-Z,Ñ,&]{3,4}([0-9]{2})(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1])$/;

	public regexRFC12: RegExp =  /^[A-Z,Ñ,&]{3}([0-9]{2})(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1])[A-Z|\d]{3}$/;

	public regexRFC9: RegExp =  /^[A-Z,Ñ,&]{3}([0-9]{2})(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1])$/

	constructor(){
		super();
	}


	ngOnInit(){
		// Logger.log(this);
		this.control = this.group.get(this.name) as FormControl;
		this.control.valueChanges.subscribe(this.validate.bind(this));
	}


	public validate(_value){
		// Logger.log('CURP RFC validate() ', _value.length);
		if(_value)
			_value = _value.toUpperCase();

		if (_value != null){
			if(_value.length > 0)
				if (this.curp == true)
					if ((_value == "") || (_value.length == 18 && this.regexCURP.test(_value)))
						this.valid();
					else
						this.invalid();
						
				else
					if(this.max === 13)
						if ((_value.length == 13 && this.regexRFC.test(_value)))
							this.valid();
						else if ((_value.length == 10 && this.regexRFC10.test(_value)))
							this.valid();
						else
							this.invalid();
					else
						if ((_value.length == 12 && this.regexRFC12.test(_value)))
							this.valid();
						else if ((_value.length == 9 && this.regexRFC9.test(_value)))
							this.valid();
						else
							this.invalid();
			else
				this.valid();

					

			if(_value.toString().length > this.max)
				this.control.setValue(_value.toString().slice(0,this.max));

		}
	}

	public valid(){
		this.hintEnd = ""
		this.control.setErrors(null);
	}

	public invalid(){
		this.hintEnd = this.curp ? "Este CURP no es valido" : "Este RFC no es valido";
		this.control.setErrors({'incorrect': true});
	}
}



