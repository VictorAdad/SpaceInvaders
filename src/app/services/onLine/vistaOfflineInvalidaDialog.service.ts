import { Injectable } from '@angular/core';
import { ConfirmationService } from '@jaspero/ng2-confirmations';
import { MatDialog } from '@angular/material';
import { Logger } from "@services/logger.service";
import { VistaOfflineInvalidDialog } from '@components-app/onLine/vistaOfflineInvalidDialog.component';
import { Router, ActivatedRoute } from '@angular/router';

@Injectable()
export class DialogVistaInvalidaOfflineService{
    public _LOADER : boolean = false;
    settings={
        overlayClickToClose: false, // Default: true
        showCloseButton: false, // Default: true
        confirmText: "Continuar", // Default: 'Yes'
        declineText: "Cancelar",
    };

    constructor(public dialog: MatDialog, private router: Router) {
        this.router.events.subscribe(e =>{
            console.log(e);
        });
    }

    isOpen=false;
    dialogo:any;

    open() {
        if (!this.isOpen){
            Logger.log("%c" + "-> Dialogo invalida vista bierto", "color: blue;font-weight:bold;");
            this.dialogo=this.dialog.open(
                VistaOfflineInvalidDialog,{
                height: 'auto',
                width: 'auto',
                disableClose:true,
                data:{funcion: this.redirige.bind(this),}
                }
            );
            this.isOpen=true;
        }
    }

    redirige(){
        console.log("Entro a redirigir");
        var obj = this;
        this.router.navigate(['/']).then(
            function(e){
                console.log('navigate success',e, obj.router);
                obj.router.navigate(['/']);
            },
            function(e){
                console.log('navigate failure',e);
            }
        );
        console.log("Cambio de salir");
        this.close();
    }
    close(){
        if (this.isOpen){
            Logger.log("%c" + "-> Dialogo cerrado", "color: red;font-weight:bold;");
            this.dialogo.close()
            this.isOpen=false;
        }
    }
}