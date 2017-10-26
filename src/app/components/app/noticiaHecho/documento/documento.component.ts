import { Component,ViewChild, Inject } from '@angular/core';

import { MatPaginator } from '@angular/material';
import { TableService} from '@utils/table/table.service';
import { MiservicioService,MDato } from '@services/miservicio.service';

import {DataSource} from '@angular/cdk/collections';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import {MatDialog, MAT_DIALOG_DATA} from '@angular/material';
import { DocumentoCreateComponent } from './create/create.component';
import { CIndexedDB } from '@services/indexedDB';
import { ActivatedRoute } from '@angular/router';
import { OnLineService} from '@services/onLine.service';

@Component({
    selector: 'documento',
    templateUrl: './documento.component.html'
})

export class DocumentoComponent{
    private db: CIndexedDB 
    constructor(public dialog: MatDialog,private _db: CIndexedDB, private onLine: OnLineService, private route:ActivatedRoute){
      this.db=_db;
    }

    displayedColumns = ['nombre', 'procedimiento', 'fecha'];
    data: Documento[];
    dataSource: TableService | null;
    casoId:number;

    @ViewChild(MatPaginator) paginator: MatPaginator;

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
        this.route.parent.params.subscribe(params => {
            if(params['id']){
                // this.casoId = +params['id'];
                // if(this.onLine.onLine){
                    
                // }else{
                //     this.cargaArchivos();
                // }       
                this.cargaArchivos();         
            }
        });  
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
          console.log("tho blob",t);
        var b=this.dataURItoBlob(t["blob"].split(',')[1], type );
        console.log("blob",b);
        var a = document.createElement('a');
        a.download = name;
        a.href=window.URL.createObjectURL( b );
        console.log(a);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
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