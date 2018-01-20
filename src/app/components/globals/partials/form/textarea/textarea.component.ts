import { Component, Input, Output, EventEmitter , OnInit, AfterViewInit, ViewChild, Renderer} from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
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
	@Input() max :number = 30000;
	@Input() rows :number = 10;
	@Input() readonly :boolean = false;
	@Input() focus :boolean = false;

	@ViewChild('textAreaComponent') textAreaComponent;

	@Output() valueChange:EventEmitter<string> = new EventEmitter<string>();

	public control: FormControl;

	constructor(private renderer : Renderer){

	}

	ngOnInit(){
		if (this.group !=null && this.name != null && this.name != '') {
			this.control = this.group.get(this.name) as FormControl;

			if(this.control.errors)
				if(this.control.errors.required)
					this.hintStart = 'Campo requerido';
		}
	}

	ngAfterViewInit(){
		this.renderer.listen(
			this.textAreaComponent.nativeElement, 'keyup', (event) => { this.inputSlice(); });

		if(this.focus){
			let timer = Observable.timer(1);

			timer.subscribe( t => {
				this.textAreaComponent.nativeElement.focus();
			});
		}
	}

	update(value) {
		this.valueChange.emit(value);
		if(this.functionChange){
			this.functionChange(value);
		}
	}

	inputSlice(){
		if (this.value && this.value.toString().length > this.max) {
			this.value = this.value.toString().trim().slice(0,this.max);
		}
		else if  (this.value && this.value.toString().length>0 && (/^\s*$/).test(this.value) )
				this.value = this.value.toString().trim();
	}
}



