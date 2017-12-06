import { Component, Input, Output, EventEmitter , OnInit, AfterViewInit, ViewChild, Renderer} from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';


@Component({
	selector: 'base-input',
	template: 'base-input.component.html' 
})
export class BaseInputComponent implements OnInit{

	@Input() label: string;

	@Input() value: string;

	@Input() prefix: string;

	@Input() sufix: string;

	@Input() prefixIcon: string;

	@Input() sufixIcon: string;

	@Input() name: string  = '';

	@Input() group: FormGroup = new FormGroup({});

	@Input() hintStart: string="";

	@Input() hintEnd: string="";

	@Input() max: number = 50;

	@Input() readonly: boolean = false;

	@Input() functionChange: Function;

	@Input() regex: RegExp;

	@Output() valueChange:EventEmitter<string> = new EventEmitter<string>();

	@ViewChild('input') input;

	public control: FormControl;

	public backupValue : string;

	constructor(public renderer : Renderer = null){

	}

	ngOnInit(){

	}

}



