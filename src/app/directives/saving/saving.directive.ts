import { Directive, ElementRef, HostListener, Input, Output, EventEmitter, Component, Inject, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { GlobalService } from "@services/global.service";
import { ConfirmationService } from '@jaspero/ng2-confirmations';
import { ResolveEmit,ConfirmSettings} from '@utils/alert/alert.service';
import { Observable } from 'rxjs';
import { Logger } from "@services/logger.service";

@Directive({ selector: '[_saving]' })
export class SavingDirective{
	public el         : ElementRef;
	public isSaving   : boolean = false;
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


    constructor(
    	_el: ElementRef,
    	public globalService : GlobalService,
    	private _confirmation: ConfirmationService,
    	public dialog: MatDialog) {
    	this.el =  _el;
    }

    public saving(){
    	Logger.log('Boton----->', this.el);
    	if(!this.globalService._SAVING){
			this.globalService._SAVING = true;
			// this.el.nativeElement.click();
			Logger.log('Guardando');
			this.prepareSave(true);
			this.saveFn().then(
				response => {
					this.globalService._SAVING = false;
					this.prepareSave(false);
					this.globalService.openSnackBar(response);
				},
				error => {
					Logger.error('Ocurrio un error al guardar D:', error);
					this.globalService._SAVING = false;
					this.globalService.openSnackBar('X Ocurrió un error al guardar');
					this.prepareSave(false);
				}
			);
		}
    }

    openDialog(): void {
	    let dialogRef = this.dialog.open(savingComponent, {
	      	width: '400px',
	      	height: '300px',
	      	data: { saving: this.saving.bind(this) }
	    });

	    dialogRef.afterClosed().subscribe(result => {
	    	console.log('The dialog was closed');
	    });
	}


	@HostListener('click') beforeSave() {
		Logger.log('SavingDirective@save()');
		// this._confirmation.create('Advertencia','¿Estás seguro de guardar la información?',this.settings)
		this.openDialog();
	}

	private getSavingText(_saving : boolean): string{
    	return _saving ? 'Guardando...' : "Guardar";
	}

	private prepareSave(save : boolean){
		this.globalService._LOADER = save;
		this.el.nativeElement.disabled = save;
		this.el.nativeElement.innerText = this.getSavingText(save);
	}
}

@Component({
  	selector: 'savingComponent',
  	templateUrl: './saving.component.html',
  	styles: [
  		'h1 {font-size: 50px;}',
  		'#content {position: relative; top: 50px;}',
  		'#button {position: relative; top: 110px;}',
  		'#buttonRed {background: #9b1e13; color: #ffffffde;}'
  	]
})
export class savingComponent {
	public el         : ElementRef;
	saveFn: any;
	block: boolean = false;

	constructor(
		_el: ElementRef,
		public dialogRef: MatDialogRef<savingComponent>,
	    public globalService : GlobalService,
	    @Inject(MAT_DIALOG_DATA) public data: any) {
	    this.el = _el;
	    console.log('boton ------------>', this.el);
	}

	onNoClick(): void {
		this.dialogRef.close();
	}
	saveClick():void{
		this.block = true;
	  	this.data.saving();
	  	this.dialogRef.close();
	}
}


