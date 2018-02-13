import { Directive, ElementRef, HostListener, Input, OnInit, Output, EventEmitter, Component, Inject, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { GlobalService } from "@services/global.service";
import { ConfirmationService } from '@jaspero/ng2-confirmations';
import { ResolveEmit,ConfirmSettings} from '@utils/alert/alert.service';
import { Observable } from 'rxjs';
import { Logger } from "@services/logger.service";

@Directive({ selector: '[_saving]' })
export class SavingDirective implements OnInit {

    public el: ElementRef;

    public savingText  = '';

    @Input()
    public preSave: Function;

    @Input('saveFn')
    saveFn: any;

    @Input('isEdit')
    public isEdit: boolean = false;

    public settings: ConfirmSettings = {
        overlayClickToClose: false, // Default: true
        showCloseButton: true, // Default: true
        confirmText: "Continuar", // Default: 'Yes'
        declineText: "Cancelar",
    };


    constructor(
        _el: ElementRef,
        public globalService: GlobalService,
        private _confirmation: ConfirmationService,
        public dialog: MatDialog) {
        this.el =  _el;
    }

    ngOnInit() {

    }

    public saving() {
        if (!this.globalService._SAVING) {
            this.save();
        }
    }

    openDialog(): void {
        const dialogRef = this.dialog.open(savingComponent, {
              width: '400px',
              height: '300px',
              data: { saving: this.saving.bind(this) }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
        });
    }


    @HostListener('click')
    public beforeSave() {
        if (this.preSave) {
            this.preSave(this.openDialog.bind(this));
        } else {
            this.openDialog();
        }
    }

    private getSavingText(_saving: boolean): string {
        return _saving ? 'Guardando...' : 'Guardar';
    }

    private prepareSave(save: boolean) {
        this.globalService._LOADER = save;
        this.el.nativeElement.disabled = save;
        this.el.nativeElement.innerText = this.getSavingText(save);
    }

    private save() {
        this.globalService._SAVING = true;
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


