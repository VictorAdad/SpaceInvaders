import { Component, ViewChild } from '@angular/core';
import { MdPaginator, MdDialog, MdDialogRef, MD_DIALOG_DATA} from '@angular/material';
import { TableService} from '@utils/table/table.service';

@Component({
    templateUrl:'tranferir.component.html'
})
export class TransferirComponent{
    constructor(public dialogRef: MdDialogRef<TransferirComponent>){}

    close(){
        this.dialogRef.close();
    }
}

@Component({
    templateUrl:'./component.html',
    selector:'titular'
})
export class TitularComponent{
	columns = ['operador', 'oficina', 'titular', 'asignacion', 'nic', 'transferir'];
	data      :Titular[];
	dataSource: TableService | null;
	@ViewChild(MdPaginator) paginator: MdPaginator;

	constructor(public dialog: MdDialog){}

	ngOnInit() {
        this.data = data;
    	this.dataSource = new TableService(this.paginator, this.data);
    	console.log('-> Data Source', this.dataSource);
  	}

    transferirDialog() {
        this.dialog.open(TransferirComponent, {
            height: 'auto',
            width: '500px'
        });
    }

}


export class Titular {
    id        : number;
    operador  : string;
    oficina   : string;
    titular   : string;
    asignacion: string;
    nic       : string;
}

const data: Titular[] = [
    {id:1, operador: "Unidad de servicios",   oficina: 'Centro de atención', titular: 'Roberto Sanchez', asignacion: '06/07/2017', nic: '1234'},
    {id:2, operador: "Unidad de servicios",   oficina: 'Centro de atención', titular: 'Roberto Sanchez', asignacion: '06/07/2017', nic: '1234'},
];
