import {Component, Inject} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { Logger } from "@services/logger.service";

@Component({
  templateUrl: 'progressDialog.component.html',
})
export class ProgressDialog {

	color = 'primary';
	mode = 'indeterminate';
	value = 0;
	bufferValue = 75;
	catalogo="algun catalogo";

  constructor(
    public dialogRef: MatDialogRef<ProgressDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) { 
  	this.catalogo=this.data.catalogo;
  	Logger.log("Data",data);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}