import { Component, Input, Output, EventEmitter, ViewChild, Renderer } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';



@Component({
	selector    : 'select2',
  	templateUrl : './select2.component.html'
})
export class Select2Component{
	@Input() options: MOption[] = [];
	@Input() value: any;
	@Input() placeholder: string;
	@Input() name     : string  = '';
	@Input() required : boolean = false;
	@Input() group    : FormGroup = new FormGroup({});
	@Input() hintStart: string="";
	@Input() hintEnd: string="";
	@Input() search: boolean = true;
	@Output() valueChange:EventEmitter<string> = new EventEmitter<String>();
	@ViewChild('searchInput') searchInput;

	public searchControl: FormControl = new FormControl();
	public filteredOptions: MOption[];

	constructor(private renderer : Renderer){

	}

	ngOnInit(){
		this.setFilterList();
	}

	ngAfterViewInit(){
		this.renderer.listen(
			this.searchInput.nativeElement, 'keyup', this.filter.bind(this));
	}


	//TODO: Falta ver como sincronizar los cambios los radio.
	public update(value) {
		this.valueChange.emit(value);
	}

	public filter(val: any) {
		// console.log('Select@filter()', val);
		// console.log('options', this.options);
  		this.filteredOptions =  this.options.filter(option => option.label.toLowerCase().indexOf(val.target.value.toLowerCase()) === 0 );
   	}

   	public setFilterList(){
   		if(this.search){
   			// console.log(this.options)
   			let timer = Observable.timer(1,1000);
   			let subs = timer.subscribe( 
   				t =>{
   					if(this.options)
							if(this.options.length > 0){
								this.options = this.options.sort(function(a, b){
						            if(a.label < b.label) return -1;
						            if(a.label > b.label) return 1;
						            return 0;
						        });
							// console.log('-> Tiene options');
							subs.unsubscribe();
						}
					this.filteredOptions = this.options;
				}
			);
		}
   	}

   	public setCursor(){
   		if(this.searchInput)
   			this.searchInput.nativeElement.focus();
   	}

}

export class MOption{
	value: any;
	label: any;
}