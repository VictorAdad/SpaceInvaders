import { Component, Input, Output, EventEmitter , OnInit, AfterViewInit, ViewChild, Renderer} from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';


@Component({
	selector    : 'text',
  	templateUrl : './text.component.html'
})
export class TextComponent implements OnInit{
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
	@Input() valRfCurp : boolean =null;
	@Input() functionChange: Function;
	@Input() regex: RegExp;
	@ViewChild('textComponent') textComponent;
	backupValue : string;


	@Output() valueChange:EventEmitter<string> = new EventEmitter<String>();

	constructor(private renderer : Renderer){

	}

	ngOnInit(){
		// console.log(this);
	}

	ngAfterViewInit(){
		this.renderer.listen(
			this.textComponent.nativeElement, 'keyup', (event) => { this.inputSlice(); });
	}

	update(value) {
		this.valueChange.emit(value);
		if(this.functionChange){
			this.functionChange(value);
		}
	}

	inputSlice(){
		if (this.value!=null) {
			if (this.valRfCurp == true){
				let regex = /^[A-Z]{1}[AEIOU]{1}[A-Z]{2}[0-9]{2}(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1])[HM]{1}(AS|BC|BS|CC|CS|CH|CL|CM|DF|DG|GT|GR|HG|JC|MC|MN|MS|NT|NL|OC|PL|QT|QR|SP|SL|SR|TC|TS|TL|VZ|YN|ZS|NE)[B-DF-HJ-NP-TV-Z]{3}[0-9A-Z]{1}[0-9]{1}$/
				if (this.value.length == 18 || this.value == null || this.value == ""){
					if(!regex.test(this.value)){
						this.hintEnd = "Este CURP no es valido"
						this.group.controls[this.name].setErrors({'incorrect': true});
					}else{	
						this.hintEnd = ""
						this.group.controls[this.name].setErrors(null);
					}
				}else{
					this.hintEnd = "Este CURP no es valido"
					this.group.controls[this.name].setErrors({'incorrect': true});	
				}	
			}
			if (this.valRfCurp == false){
				let regex = /^[A-Z,Ñ,&]{3,4}([0-9]{2})(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1])[A-Z|\d]{3}$/
				if (this.value.length >= 12 || this.value == null || this.value == "") {
					if(!regex.test(this.value)){
						this.hintEnd = "Este RFC no es valido"
						this.group.controls[this.name].setErrors({'incorrect': true});
					}else{	
						this.hintEnd = ""
						this.group.controls[this.name].setErrors(null);
					}
				}else{
					this.hintEnd = "Este RFC no es valido"
					this.group.controls[this.name].setErrors({'incorrect': true});	
				}	
			}
		}

		if (this.value!=null && this.value.toString().length > this.max) {
			this.value = this.value.toString().slice(0,this.max);
		}

		if(this.regex)
			if(!this.regex.test(this.value))
				this.value = this.backupValue;

		this.backupValue = this.value

	}
}



