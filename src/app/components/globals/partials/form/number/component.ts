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
  	@Input() maxValue :number = 999999999999;
  	@Input() sinDecimales : boolean = false; 
	backupValue : string;

  	@ViewChild('numberComponent') numberComponent;

	@Output() valueChange:EventEmitter<string> = new EventEmitter<String>();

	constructor(private renderer: Renderer){
	}

	ngOnInit(){
    console.log('-------------> ',this);

	}

	ngAfterViewInit(){
		this.renderer.listen(
			this.numberComponent.nativeElement, 'keyup', (event) => { this.inputSlice(event); });
	}

	update(value) {
		this.valueChange.emit(value);
		if(this.functionChange){
			this.functionChange(value);
		}
	}

	//69 189

	inputSlice(event){
		console.log('HH------------>', event);

		if (event.keyCode == 189 || event.keyCode == 69) {
			if(this.backupValue == null){
				this.value = '0';	
			}else{
				this.value = this.backupValue;
			}
			return
		}
		if (this.value!=null && this.value.toString().length > this.max) {
			this.value = this.value.toString().slice(0,this.max);
		}
		this.backupValue = this.value;
	}



}




