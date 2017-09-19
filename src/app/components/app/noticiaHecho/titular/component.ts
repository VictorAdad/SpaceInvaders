import { Component, ViewChild } from '@angular/core';
import { MdPaginator, MdDialog, MdDialogRef, MD_DIALOG_DATA} from '@angular/material';
import { TableService} from '@utils/table/table.service';

@Component({
    templateUrl:'tranferir.component.html'
})
export class TransferirComponent{
    constructor(public dialogRef: MdDialogRef<TransferirComponent>){}
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
            width: 'auto'
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
    {id:1, operador: "Defensor del imputado",     oficina: '', titular: '', asignacion: '', nic: ''},
    {id:2, operador: "Imputado víctima delito",   oficina: '', titular: '', asignacion: '', nic: ''},
];
