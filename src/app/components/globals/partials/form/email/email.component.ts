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

	constructor(private renderer : Renderer){

	}

	ngOnInit(){
		// console.log(this);
	}

	ngAfterViewInit(){
		this.renderer.listen(
			this.emailComponent.nativeElement, 'keyup', (event) => { this.inputSlice(); });
	}

	update(value) {
		this.valueChange.emit(value);
		if(this.functionChange){
			this.functionChange(value);
		}
	}

	inputSlice(){
		var rejex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

		if (this.value!=null && this.value.toString().length > this.max) {
			this.value = this.value.toString().slice(0,this.max);
		}
		if (this.value == null || this.value == "" || rejex.test(this.value)) {
			console.log('-----------> uno',this.value);
			this.hintEnd = ""
			this.group.controls[this.name].setErrors(null);
		}else{	
			this.hintEnd = "Este correo no es valido"
			this.group.controls[this.name].setErrors({'incorrect': true});
			console.log('-----------> dos',this.value);
		}
	}
}

