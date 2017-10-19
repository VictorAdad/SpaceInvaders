import { Component, Inject } from '@angular/core';
import { MatDialogRef,MAT_DIALOG_DATA } from '@angular/material';
import {DataSource} from '@angular/cdk/collections';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { CIndexedDB } from '@services/indexedDB';
import { HttpService } from '@services/http.service';
import { Delito } from '@models/catalogo/delito';

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

export class FormCreateDelitoComponent {

    optionLista=[];
    addList=[];
    listaBuscar=[];
    textSearch:string;
    tabla:CIndexedDB;
    listaDeSeleccionados=[];
    clasificacion:number;
    searchDelito:string;
    constructor(
        private http: HttpService,
        private _tabla: CIndexedDB,
        @Inject(MAT_DIALOG_DATA) private data: {lista:any},
        public dialogRef: MatDialogRef<FormCreateDelitoComponent>
        ){
        this.tabla=_tabla;
    }

    ngOnInit(){
        this.addList=this.data.lista;
        this.dataSourceaddList=new ExampleDataSource([]);
    }

    displayedColumns = ['resultado'];
    dataSource = new ExampleDataSource(this.optionLista);
    dataSourceaddList=new ExampleDataSource([]);
    dataList=[
                
            ];

    setDelito(value){
        this.searchDelito = value;
    }

    buscar(){
        
        this.http.get('/v1/catalogos/delitos/search?name='+this.searchDelito).subscribe(response => {
            console.log('-> done buscar delito', response);
            this.dataSource = new ExampleDataSource(response);
        });
    }

    agregar(e){
        this.listaDeSeleccionados=[];
        this.listaDeSeleccionados.push(e);
        this.dataSourceaddList=new ExampleDataSource(this.listaDeSeleccionados);
    }

    guardar(){
        if (this.listaDeSeleccionados.length>0){
            this.addList.push(this.listaDeSeleccionados[0]);
        }
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




// const URL = '/api/';
const URL = 'https://evening-anchorage-3159.herokuapp.com/api/';