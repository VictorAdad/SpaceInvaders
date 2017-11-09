import { Component, Input, Output, EventEmitter , OnInit, AfterViewInit, ViewChild, Renderer} from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

@Component({
	selector    : 'number',
  	templateUrl : './component.html'
})
export class NumberComponent implements OnInit{
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
	@Input() functionChange: Function;
  	@Input() max :number = 12;
  	@Input() maxValue :number = 12;
  	@ViewChild('numberComponent') numberComponent;

	@Output() valueChange:EventEmitter<string> = new EventEmitter<String>();

	constructor(private renderer: Renderer){
	}

	ngOnInit(){
    console.log('-------------> ',this);

	}

	ngAfterViewInit(){
		this.renderer.listen(
			this.numberComponent.nativeElement, 'keyup', (event) => { this.inputSlice(); });
	}

	update(value) {
		this.valueChange.emit(value);
		if(this.functionChange){
			this.functionChange(value);
		}
	}

	inputSlice(){
		if (this.value!=null && this.value.toString().length > this.max) {
			this.value = this.value.toString().slice(0,this.max);
		}
	}



}




