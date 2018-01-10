import { Injectable } from '@angular/core';
import { ConfirmationService } from '@jaspero/ng2-confirmations';
import { MatDialog } from '@angular/material';
import { Logger } from "@services/logger.service";
import { LoginDialog } from '../../components/app/onLine/loginDialog.component';

@Injectable()
export class LoginDialogService{
    public _LOADER : boolean = false;
    public funccionDespues:Function=null;
   

    constructor(public dialog: MatDialog) {}

    isOpen=false;
    dialogo:any;
    onLine:any;

    setOnLine(onLine){
        this.onLine=onLine;
    }

    open() {
        if (!this.isOpen){
            Logger.log("%c" + "-> Dialogo abierto", "color: blue;font-weight:bold;");
            let dialogRef = this.dialog.open(LoginDialog, {
                    width: '400px',
                    height: '400px',
                    data: null
            });
  
            dialogRef.afterClosed().subscribe(result => {
                console.log('The dialog was closed',this.funccionDespues);
                if (this.funccionDespues)
                    this.funccionDespues(result);
                this.isOpen=false;
            });
            this.isOpen=true;
        }
    }
    close(){
        if (this.isOpen){
            Logger.log("%c" + "-> Dialogo cerrado", "color: red;font-weight:bold;");
            this.dialogo.close()
            this.isOpen=false;
        }
    }
}