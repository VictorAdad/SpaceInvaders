import { Component,ViewChild, Inject } from '@angular/core';

import { MdPaginator } from '@angular/material';
import { TableService} from '@utils/table/table.service';
import { MiservicioService,MDato } from '@services/miservicio.service';

import {DataSource} from '@angular/cdk/collections';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import {MdDialog, MD_DIALOG_DATA} from '@angular/material';
import { DocumentoCreateComponent } from './create/create.component';
import { CIndexedDB } from '@services/indexedDB';

@Component({
    selector: 'documento',
    templateUrl: './documento.component.html'
})

export class DocumentoComponent{
    private db: CIndexedDB 
    constructor(public dialog: MdDialog,private _db: CIndexedDB){
      this.db=_db;
    }

    displayedColumns = ['nombre', 'procedimiento', 'fecha'];
    data: Documento[];
    //dataSource: TableService | null;
    dataSource = new ExampleDataSource();
    @ViewChild(MdPaginator) paginator: MdPaginator;

    dataURItoBlob(dataURI, type) {
        var binary = atob(dataURI);
        var array = [];
        for(var i = 0; i < binary.length; i++) {
            array.push(binary.charCodeAt(i));
        }
        return new Blob([new Uint8Array(array)], {type: type});
    }
    
    ngOnInit(){
        this.data = data;
        this.dataSource = new TableService(this.paginator, this.data);
        console.log('-> Data Source', this.dataSource);
        this.cargaArchivos();
    }

    cargaArchivos(){
      this.db.list("documentos").then(archivos=>{
        var lista=archivos as any[];
        this.dataSource = new TableService(this.paginator, lista);
      });
    }

    download(idBlob,name,type){
      console.log(idBlob,name,type);
      this.db.get("blobs",idBlob).then(t=>{
        var b=this.dataURItoBlob(t["blob"].split(',')[1], type );
        var a = document.createElement('a');
        a.download = name;
        a.href=window.URL.createObjectURL( b );;
        a.click();
        a.remove();
      });
    }

    openDialog() {
        var dialog=this.dialog.open(DocumentoCreateComponent, {
            height: 'auto',
            width: 'auto'
        });
        dialog.afterClosed().subscribe(() => {
          this.cargaArchivos();
        });
      }
}

export interface Documento {
    nombre: string;
    procedimiento: string;
    fecha: string;
  }
  
  const data: Documento[] = [
      {nombre: 'Entrevista.pdf', procedimiento: '7.3.1 ENTREVISTA', fecha: 'ayer a las 11:30'}
  ];

    /**
   * Data source to provide what data should be rendered in the table. The observable provided
   * in connect should emit exactly the data that should be rendered by the table. If the data is
   * altered, the observable should emit that new set of data on the stream. In our case here,
   * we return a stream that contains only one set of data that doesn't change.
   */
  export class ExampleDataSource extends DataSource<any> {
    /** Connect function procedimientod by the table to retrieve one stream containing the data to render. */
    connect(): Observable<Documento[]> {
      return Observable.of(data);
    }
  
    disconnect() {}
  }