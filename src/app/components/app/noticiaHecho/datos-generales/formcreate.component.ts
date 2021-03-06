import { Component, Inject, Output, EventEmitter } from '@angular/core';
import { MatDialogRef,MAT_DIALOG_DATA } from '@angular/material';
import {DataSource} from '@angular/cdk/collections';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { CIndexedDB } from '@services/indexedDB';
import { HttpService } from '@services/http.service';
import { Delito } from '@models/catalogo/delito';
import { OnLineService } from '@services/onLine.service';
import { Logger } from "@services/logger.service";

@Component({
    templateUrl: './formcreate.component.html',
    styles:[`
      .fondo{
        margin:5%; 
        border-radius: 0; 
        border-collapse: black; 
        border-style: solid;
        background-color: #e9ecef;
      }
      .cuadro{
        border-radius: 0; 
        border-collapse: black; 
        border-style: solid;
      }
      `
      ]
})

export class FormCreateDelitoCasoComponent {

    optionLista=[];
    addList=[];
    listaBuscar=[];
    textSearch:string;
    tabla:CIndexedDB;
    listaDeSeleccionados=[];
    clasificacion:number;
    searchDelito: string = '';
    selectedDelito: Delito;
    @Output() emitter = new EventEmitter();

    constructor(
        private _tabla: CIndexedDB,
        @Inject(MAT_DIALOG_DATA) private data: {lista:any},
        public dialogRef: MatDialogRef<FormCreateDelitoCasoComponent>,
        private http: HttpService,
        private onLine: OnLineService,
        ){
        this.tabla=_tabla;
    }

    ngOnInit(){
        this.dataSourceaddList=new ExampleDataSource([]);
    }

    displayedColumns = ['resultado'];
    dataSource = new ExampleDataSource(this.optionLista);
    dataSourceaddList=new ExampleDataSource([]);
    dataList=[
                
            ];

    buscar(_event){

        this.searchDelito = _event;

        if (typeof this.searchDelito == "undefined")
            this.searchDelito="";
        if (this.onLine.onLine)
            this.http.get('/v1/catalogos/delitos/search?name='+this.searchDelito).subscribe(response => {
                Logger.log('-> done buscar delito', response);
                this.dataSource = new ExampleDataSource(response);
            });
        else
            this.tabla.get("catalogos","delito").then(response=>{
                var delitos =[];
                if (response && response["arreglo"]){
                    var lista=response["arreglo"] as any[];
                    for (var i = 0; i < lista.length; ++i) {
                        if (typeof this.searchDelito == 'string'&& lista[i]["nombre"].indexOf(this.searchDelito.toUpperCase())>=0){
                            delitos.push(lista[i]);
                        }
                    }
                }

                Logger.log('%c-> done buscar delito',"color: red;", delitos, this.searchDelito);
                this.dataSource = new ExampleDataSource(delitos);
            });
    }

    agregar(e){
        this.listaDeSeleccionados=[];
        this.listaDeSeleccionados.push(e);
        this.selectedDelito = e;
        this.dataSourceaddList=new ExampleDataSource(this.listaDeSeleccionados);
    }

    fireEvent(){
        this.emitter.emit(this.selectedDelito);
        this.dialogRef.close();
    }

    cerrar(){
        this.dialogRef.close();
    }
}

export class ExampleDataSource extends DataSource<any> {

  data=[];

  constructor(data: any) {
        super();
        this.data=data;
    }
  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<Element[]> {
    return Observable.of(this.data);
  }

  disconnect() {}
}