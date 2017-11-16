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
	@ViewChild('textComponent') textComponent;


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
				if (this.value.length == 18 || this.value == null || this.value == "") {
					this.hintEnd = ""
					this.group.controls[this.name].setErrors(null);
				}else{
					this.hintEnd = "Este CURP no es valido"
					this.group.controls[this.name].setErrors({'incorrect': true});	
				}	
			}
			if (this.valRfCurp == false){
				if (this.value.length >= 12 || this.value == null || this.value == "") {
					this.hintEnd = ""
					this.group.controls[this.name].setErrors(null);
				}else{
					this.hintEnd = "Este RFC no es valido"
					this.group.controls[this.name].setErrors({'incorrect': true});	
				}	
			}
		}

		if (this.value!=null && this.value.toString().length > this.max) {
			this.value = this.value.toString().slice(0,this.max);
		}
	}
}



