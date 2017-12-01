import { Component, Input, Output, EventEmitter , OnInit, AfterViewInit, ViewChild, Renderer} from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

@Component({
	selector    : 'email',
  	templateUrl : './email.component.html'
})

export class EmailComponent implements OnInit{
	@Input() label    : string;
	@Input() value    : string;
	@Input() prefix   : string;
	@Input() sufix    : string;
	@Input() prefixIcon : string;
	@Input() sufixIcon  : string;
	@Input() name     : string  = '';
	@Input() required : boolean = false;
	@Input() group    : FormGroup = new FormGroup({});
	@Input() hintStart: string="";
	@Input() hintEnd: string="";
	@Input() readonly: string="";
	@Input() max :number = 100;
	@Input() functionChange: Function;
	@ViewChild('emailComponent') emailComponent;


	@Output() valueChange:EventEmitter<string> = new EventEmitter<String>();

	public control: FormControl;

	constructor(private renderer : Renderer){

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
		var rejex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

		if (_value!=null && _value.toString().length > this.max) {
			this.control.setValue(_value.toString().slice(0,this.max));
		}
		if (_value == null || _value == "" || rejex.test(_value)) {
			this.valid();
		}else{	
			this.inValid();

		}
	}

	public valid(){
		this.hintEnd = ""
		this.control.setErrors(null);
	}

	public inValid(){
		this.hintEnd = "Este correo no es valido"
		this.control.setErrors({'incorrect': true});
	}
}

