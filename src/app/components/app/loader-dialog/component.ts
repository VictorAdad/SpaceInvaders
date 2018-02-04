import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Logger } from "@services/logger.service";

@Component({
    templateUrl: 'component.html',
})
export class LoaderDialog {

    public titulo = '';

    public subtitulo = '';

    public color = 'primary';

    public mode = 'indeterminate';

    public value = 0;

    public bufferValue = 75;

    constructor(
        public dialogRef: MatDialogRef<LoaderDialog>,
        @Inject(MAT_DIALOG_DATA) public data: any) {
        this.titulo = this.data.titulo;
        this.subtitulo = this.data.subtitulo;
    }

    close(): void {
        this.dialogRef.close();
    }

}
