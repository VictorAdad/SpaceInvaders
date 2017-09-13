import {Component, Inject} from '@angular/core';
import {MdDialog, MdDialogRef, MD_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'loader',
  templateUrl: './component.html'
})
export class LoaderComponent {

    constructor(public _dialog: MdDialogRef<LoaderComponent>) { }

}
