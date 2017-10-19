import { Injectable } from '@angular/core';
import {MatSnackBar} from '@angular/material';


@Injectable()
export class GlobalService{
	public _LOADER : boolean = false;

	constructor(public snackBar: MatSnackBar) {}

	openSnackBar(message: string) {
		this.snackBar.open(message, '', {
			duration: 2000,
		});
	}
}