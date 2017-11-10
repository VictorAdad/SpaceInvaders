import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

@Component({
	selector    : 'slide-toggle',
  	templateUrl : './slide-toggle.component.html',
})
export class SlideToggleComponent{
  @Input() checked:boolean=false;
  @Input() disabled:boolean=false;
  @Input() label:string=null;
  @Input() color:string = 'accent';
  @Input() labelPosition:string='before';
	@Output() valueChange:EventEmitter<string> = new EventEmitter<String>()

	update(value) {
		this.valueChange.emit(value);
	}

}

