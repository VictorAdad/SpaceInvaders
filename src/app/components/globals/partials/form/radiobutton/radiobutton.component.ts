import { Component, Input, Output, EventEmitter, OnInit,  ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Logger } from "@services/logger.service";

@Component({
	selector    : 'radiobutton',
  	templateUrl : './radiobutton.component.html',
  	styles: ['.ROJO { color: #f44336; }']
})
export class RadioButtonComponent {
	@Input() radios: MRadioButton[] = [];
	@Input() value: any;
	@Input() class: string;
	@Input() name     : string  = '';
	@Input() required : boolean = false;
	@Input() group    : FormGroup = new FormGroup({});
	@Input() functionChange: Function;
	@Input() requerido:boolean=false;
	@Input() focus:boolean=false;

	@Output() valueChange:EventEmitter<string> = new EventEmitter<String>();

	@ViewChild('contentRadios')
	public contentRadios;


	ngAfterViewInit(){
		if(this.focus){
			let radios = this.contentRadios.nativeElement.querySelectorAll('input');
			radios[0].focus();
		}

	}

	update(value) {
		this.valueChange.emit(value);
		if (value==null || typeof value=="undefined" || value=="" || value==" ")
				Logger.log();
		else{
			this.requerido=false;
		}
		if(this.functionChange){
			this.functionChange(value);
		}
	}

}

export class MRadioButton{
	value: string;
	label: string;
}