import { Component, Input, Output, EventEmitter , OnInit, AfterViewInit, ViewChild, Renderer} from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { BaseInputComponent } from '../base-input.component';


@Component({
	selector    : 'text',
  	templateUrl : './text.component.html'
})
export class TextComponent extends BaseInputComponent {

	constructor(public renderer : Renderer){
		super(renderer)
	}

	ngOnInit(){
		if (this.group !=null && this.name != null && this.name != '') {
			this.control = this.group.get(this.name) as FormControl;
			this.control.valueChanges.subscribe(this.inputSlice.bind(this));

			if(this.control.errors)
				if(this.control.errors.required)
					this.hintStart = 'Campo requerido';
		}
	}

	ngAfterViewInit(){
		if (!this["control"])
			this.renderer.listen(
				this.input.nativeElement, 'keyup', (event) => { this.inputSliceSinControl(); });
		if(this.focus){
			let timer = Observable.timer(1);

			timer.subscribe( t => {
				this.input.nativeElement.focus();
			});
		}
	}

	inputSliceSinControl(){
		if (this.value && this.value.toString().length > this.max) {
			this.value = this.value.toString().trim().slice(0,this.max);
		}
		else if  (this.value && this.value.toString().length>0 && (/^\s*$/).test(this.value) )
				this.value = this.value.toString().trim();
	}

	update(value) {
		this.valueChange.emit(value);
		if(this.functionChange){
			this.functionChange(value);
		}
	}

	inputSlice(_value){
		if (_value!=null) {
			if(_value.toString().length > this.max)
				this.control.setValue(_value.toString().trim().slice(0,this.max));
			else if  ( _value.toString().length>0 && (/^\s*$/).test(_value) )
				this.control.setValue(_value.toString().trim());
		}
	}
}



