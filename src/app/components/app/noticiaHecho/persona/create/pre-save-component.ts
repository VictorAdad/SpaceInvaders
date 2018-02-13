import { ElementRef, Input, OnInit, Output, EventEmitter, Component, Inject, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { GlobalService } from "@services/global.service";

@Component({
    templateUrl: './pre-save.component.html',
    styles: [
        'h1 {font-size: 50px;}',
        '#content {position: relative; top: 50px;}',
        '#button {position: relative; top: 110px;}',
        '#buttonRed {background: #9b1e13; color: #ffffffde;}'
    ]
})
export class PersonaPreSaveComponent {

    public title = 'Se han detectado cambios';

    public action: any;

    public block = false;

    constructor(
        public el: ElementRef,
        public dialogRef: MatDialogRef<PersonaPreSaveComponent>,
        public globalService: GlobalService,
        @Inject(MAT_DIALOG_DATA) public data: any) {
        if (this.data.title) {
            this.title = this.data.title;
        }
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    actionClick(): void {
        this.block = true;
        this.data.action();
        this.dialogRef.close();
    }
}
