import { Injectable } from '@angular/core';
import {MdSnackBar} from '@angular/material';


@Injectable()
export class GlobalService{
	public _LOADER : boolean = false;

	constructor(public snackBar: MdSnackBar) {}

	openSnackBar(message: string) {
		this.snackBar.open(message, '', {
			duration: 2000,
		});
	}
}