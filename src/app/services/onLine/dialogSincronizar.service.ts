import { Injectable } from '@angular/core';
import { ConfirmationService } from '@jaspero/ng2-confirmations';
import { MatDialog } from '@angular/material';
import {ProgressDialog} from '@components-app/onLine/progressDialog.component';

@Injectable()
export class DialogSincrinizarService{
    public _LOADER : boolean = false;
    settings={
        overlayClickToClose: false, // Default: true
        showCloseButton: false, // Default: true
        confirmText: "Continuar", // Default: 'Yes'
        declineText: "Cancelar",
    };

    constructor(public dialog: MatDialog) {}

    isOpen=false;
    dialogo:any;

    open() {
        if (!this.isOpen){
            console.log("%c" + "-> Dialogo abierto", "color: blue;font-weight:bold;");
            this.dialogo=this.dialog.open(
                ProgressDialog,{
                height: 'auto',
                width: 'auto',
                disableClose:true,
                data:{catalogo:"",}
                }
            );
            this.isOpen=true;
        }
    }
    close(){
        if (this.isOpen){
            console.log("%c" + "-> Dialogo cerrado", "color: red;font-weight:bold;");
            this.dialogo.close()
            this.isOpen=false;
        }
    }
}