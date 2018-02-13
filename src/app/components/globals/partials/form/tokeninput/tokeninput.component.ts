import { Component, Input, Output, EventEmitter } from '@angular/core';

import {FormControl, ReactiveFormsModule} from '@angular/forms';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';

/**
 * @title Filter autocomplete
 */
@Component({
  selector: 'tokeninput',
  templateUrl: 'tokeninput.component.html'
})
export class TokenInputComponent {

  myControl: FormControl = new FormControl();

  @Input() options = [
    'One',
    'Two',
    'Three'
  ];

  @Input() label:string="Token Input";
  @Input() value: string;

  filteredOptions: Observable<string[]>;

   ngOnInit() {
      this.filteredOptions = this.myControl.valueChanges
         .startWith(null)
         .map(val => val ? this.filter(val) : this.options.slice());
   }

    filter(val: string): string[] {
      return this.options.filter(option =>
        option.toLowerCase().indexOf(val.toLowerCase()) === 0);
   }

   @Output() valueChange:EventEmitter<string> = new EventEmitter<String>()

	update(value) {
		this.valueChange.emit(value);
		this.value=value;
	}

  displayFn(opt): string {
    this.update(opt);
    return opt;
  }



}