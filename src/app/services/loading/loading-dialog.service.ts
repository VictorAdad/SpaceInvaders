import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Logger } from "@services/logger.service";
import { LoaderDialog } from '../../components/app/loader-dialog/component';

@Injectable()
export class LoadingDialogService {

    public _LOADER = false;

    public isOpen = false;

    public dialogRef: any;

    public data = {};

    constructor(public dialog: MatDialog) { }

    public setData(_data: any) {
        this.data = _data;
    }

    public open() {
        if (!this.isOpen) {
            this.dialogRef = this.dialog.open(LoaderDialog, {
                width: '400px',
                data: this.data
            });
            this.isOpen = true;
        }
    }

    public close() {
        if (this.isOpen) {
            this.dialogRef.close();
            this.isOpen = false;
        }
    }
}
