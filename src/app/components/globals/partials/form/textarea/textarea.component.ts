import { Component, Input, Output, EventEmitter , OnInit, AfterViewInit, ViewChild, Renderer} from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Logger } from "@services/logger.service";


@Component({
	selector    : 'text-area',
  	templateUrl : './textarea.component.html'
})
export class TextareaComponent implements OnInit{
	@Input() label    : string;
	@Input() value    : string;
	@Input() name     : string  = '';
	@Input() group    : FormGroup = new FormGroup({});
	@Input() functionChange: Function;
	@Input() hintStart: string="";
	@Input() hintEnd: string="";
	@Input() max :number = 1500;
	@ViewChild('textAreaComponent') textAreaComponent;

	@Output() valueChange:EventEmitter<string> = new EventEmitter<string>();

	constructor(private renderer : Renderer){

	}

	ngOnInit(){
		// Logger.log(this);
	}

	ngAfterViewInit(){
		this.renderer.listen(
			this.textAreaComponent.nativeElement, 'keyup', (event) => { this.inputSlice(); });
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



