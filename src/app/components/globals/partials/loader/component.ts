import {Component, Inject} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'loader',
  templateUrl: './component.html'
})
export class LoaderComponent {

    constructor(public _dialog: MatDialogRef<LoaderComponent>) { }

}
