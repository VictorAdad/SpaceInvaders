import { Component, Input, Output, EventEmitter, ViewChild, Renderer, SimpleChanges } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';
import { Logger } from "@services/logger.service";



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
	@Input() order : boolean = true;
	@Input() onOpenFunction: Function=null;
	@Output() valueChange:EventEmitter<string> = new EventEmitter<string>();
  @Output() haveclosed:EventEmitter<string> = new EventEmitter<string>();

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

	ngOnChanges(changes: SimpleChanges) {
		// Logger.log(changes);
		if(changes.options)
			this.filteredOptions = this.options;
	}


	//TODO: Falta ver como sincronizar los cambios los radio.
	public update(value) {
		this.valueChange.emit(value);
  }
  public onSelected(value){
    this.valueChange.emit(value);
  }

	public filter(val: any) {
		// Logger.log('Select@filter()', val);
		// Logger.log('options', this.options);
		let valNormal = val.target.value.toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, "")
  		this.filteredOptions =  this.options.filter(
  			option => {
  				let optNormal = option.label.toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, "")
  				return (optNormal.indexOf(valNormal) === 0 || optNormal.includes(valNormal));
			}
		);
   	}

   	public setFilterList(){
   		if(this.search){
   			// Logger.log(this.options)
   			let timer = Observable.timer(1,1000);
   			let subs = timer.subscribe(
   				t =>{
   					if(this.options && this.order)
							if(this.options.length > 0){
								this.options = this.options.sort(function(a, b){
						            if(a.label < b.label) return -1;
						            if(a.label > b.label) return 1;
						            return 0;
						        });
							// Logger.log('-> Tiene options');
							subs.unsubscribe();
						}
					this.filteredOptions = this.options;
				}
			);
		}
   	}

   	public setCursor(){
   		if (this.onOpenFunction)
	   			this.onOpenFunction();
   		if(this.searchInput){
   			this.searchInput.nativeElement.focus();
   		}
   	}

   	public closeSelect(){
   		// Logger.log('closeSelect()');
   		this.filteredOptions = this.options;
   	}

}

export class MOption{
	value: any;
	label: any;
}
