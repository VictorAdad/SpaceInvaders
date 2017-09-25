import { Directive, ElementRef, HostListener, Input, Output, EventEmitter } from '@angular/core';
import { GlobalService } from "@services/global.service";
import { ConfirmationService } from '@jaspero/ng2-confirmations';
import { ResolveEmit,ConfirmSettings} from '@utils/alert/alert.service';

@Directive({ selector: '[_saving]' })
export class SavingDirective{
	public el         : ElementRef;
	public saving     : boolean = false;
	public savingText : string  = '';
	public settings:ConfirmSettings={
	    overlayClickToClose: false, // Default: true
	    showCloseButton: true, // Default: true
	    confirmText: "Continuar", // Default: 'Yes'
	    declineText: "Cancelar",
    };
	
	@Output('saveFn') saveFn: EventEmitter<any> = new EventEmitter();

    constructor(_el: ElementRef, public globalService : GlobalService, private _confirmation: ConfirmationService) {
    	this.el =  _el;
    }

	@HostListener('click') save() {
		console.log('SavingDirective@save()');
		this._confirmation.create('','¿Estás seguro de guardar la información?',this.settings)
         .subscribe(
         	(ans: ResolveEmit) => {
         		// console.log(ans);
         		if(ans.resolved){
	 				this.prepareSave(true);
					this.saveFn.emit();
					this.prepareSave(false);
					this.globalService.openSnackBar('Registro guardado con éxito');
				}
         	}
		);
	}

	private getSaveingText(_saving : boolean): string{
		return _saving ? 'Guardando...' : 'Guardar';
	}

	private prepareSave(save : boolean){
		this.globalService._LOADER = save;
		this.el.nativeElement.disabled = save;
		this.el.nativeElement.innerText = this.getSaveingText(save);
	}
}


