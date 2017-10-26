import { Directive, ElementRef, HostListener, Input, Output, EventEmitter } from '@angular/core';
import { GlobalService } from "@services/global.service";
import { ConfirmationService } from '@jaspero/ng2-confirmations';
import { ResolveEmit,ConfirmSettings} from '@utils/alert/alert.service';
import { Observable } from 'rxjs';


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

	@Input('saveFn')
  saveFn: any;
  @Input('isEdit')
  public isEdit  : boolean = false;


    constructor(_el: ElementRef, public globalService : GlobalService, private _confirmation: ConfirmationService) {
    	this.el =  _el;
    }

	@HostListener('click') save() {
		console.log('SavingDirective@save()');
		this._confirmation.create('Advertencia','¿Estás seguro de guardar la información?',this.settings)
         .subscribe(
         	(ans: ResolveEmit) => {
         		if(ans.resolved){
	 				this.prepareSave(true);
					this.saveFn().then(
						response => {
							this.prepareSave(false);
							this.globalService.openSnackBar(response);
						},
						error => {
							console.error('Ocurrio un error al guardar D:', error)
							this.globalService.openSnackBar('X Ocurrió un error al guardar');
							this.prepareSave(false);
						}
					);

				}
         	}
		);
	}

	private getSaveingText(_saving : boolean): string{
    let saveName = 'Guardar';
    if(this.isEdit)
    saveName='Editar';
		return _saving ? 'Guardando...' : saveName;
	}

	private prepareSave(save : boolean){
		this.globalService._LOADER = save;
		this.el.nativeElement.disabled = save;
		this.el.nativeElement.innerText = this.getSaveingText(save);
	}
}


