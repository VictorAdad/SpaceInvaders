import { Component, Input, Output, EventEmitter , OnInit, Renderer} from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Logger } from "@services/logger.service";
import { BaseInputComponent } from '../base-input.component';

@Component({
	selector    : 'time',
  	templateUrl : './time.component.html'
})
export class TimeComponent extends BaseInputComponent implements OnInit{

	public max: number = 5

	public regex: RegExp = /^([0-1]?[0-9]|2[0-3])(:[0-5][0-9])$/;

	public regexTime: RegExp = /^[0-9():{1}]*$/;

	public rules : any

	constructor(public renderer: Renderer){
		super(renderer);
	}

	ngOnInit(){

		if(this.name != ''){
			this.control = this.group.get(this.name) as FormControl;
			this.control.valueChanges.subscribe(this.validate.bind(this));
			this.rules = this.control.errors;
		}
		Logger.log('<<< rules >>>', this.control);

	}


	update(value) {
		this.valueChange.emit(value);
		if(this.functionChange){
			this.functionChange(value);
		}
	}

	public validate(_val){
		// Logger.log('Time ', _val);
		if(_val != null)
			if(_val.length > 0){
				if(_val.length <= this.max){
					if(this.regexTime.test(_val)){
						if(!this.regex.test(_val)){
							this.hintEnd = "Formato invalido";
							this.control.setErrors({'incorrect': true});
							// this.control.setValue(this.backupValue);
						}else{
							this.hintEnd = "";
							this.control.setErrors(null);							
						}
						this.backupValue = _val;
					}else{
						this.control.setValue(this.backupValue);	
					}
				}else{
					this.control.setValue(this.backupValue);
				}
			}else{
				this.backupValue = _val;
				this.hintEnd = "";
				this.control.setErrors(null);
				this.control.setErrors(this.rules);
			}

	}
}



