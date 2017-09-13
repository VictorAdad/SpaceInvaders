import { Directive, ElementRef, HostListener, Input, Output, EventEmitter } from '@angular/core';
import { GlobalService } from "@services/global.service";

@Directive({ selector: '[_saving]' })
export class SavingDirective{
	public el         : ElementRef;
	public saving     : boolean = false;
	public savingText : string  = '';
	
	@Output('saveFn') saveFn: EventEmitter<any> = new EventEmitter();

    constructor(_el: ElementRef, public globalService : GlobalService) {
    	this.el =  _el;
    }

	@HostListener('click') save() {
		console.log('SavingDirective@save()');
		this.prepareSave(true);
		this.saveFn.emit();
		setTimeout(() => {
			this.prepareSave(false);
		}, 3000);
		
	}

	private getSaveingText(): string{
		return this.saving ? 'Guardando...' : 'Guardar';
	}

	private prepareSave(save : boolean){
		this.globalService._LOADER = save;
		this.el.nativeElement.disabled = save;
		this.el.nativeElement.innnerText = this.getSaveingText();
	}
}


