import {Component, Inject} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { Logger } from "@services/logger.service";

@Component({
  templateUrl: 'vistaOfflineInvalidDialog.component.html',
  styles:[
        `.warning{
            color: red;
            font-size: 1.2em;
        }`,
        `
        h3{
        text-align: center;
        }
        `,
        `
        .izquierda{
        text-align: right;
        }
        `,
        `
        .centro{
            text-align: center;
        }
        `

    ]
})
export class VistaOfflineInvalidDialog {

    color = 'primary';
    mode = 'indeterminate';
    value = 0;
    bufferValue = 75;

    funcion: Function = null;

    constructor(
    public dialogRef: MatDialogRef<VistaOfflineInvalidDialog>,
        @Inject(MAT_DIALOG_DATA) public data: any) { 
            this.funcion = this.data.funcion;
            Logger.log("Data",data);
    }

    close(): void {
        this.dialogRef.close();
    }

    redirige(){
        close();
        if (this.funcion) {
            this.funcion();
        }
    }

}