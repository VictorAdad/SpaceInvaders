import { Component, Inject } from '@angular/core';
import { MdDialogRef,MD_DIALOG_DATA } from '@angular/material';
import {DataSource} from '@angular/cdk/collections';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';

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
    textSearch:string;
    constructor(
        @Inject(MD_DIALOG_DATA) private data: {lista:any},
        public dialogRef: MdDialogRef<FormCreateDelitoComponent>
        ){}

    ngOnInit(){
        this.addList=this.data.lista;
        this.dataSourceaddList=new ExampleDataSource(this.addList);
    }

    displayedColumns = ['resultado'];
    dataSource = new ExampleDataSource(this.optionLista);
    dataSourceaddList=new ExampleDataSource(this.addList);
    dataList=[
                {
                    clave:"Cve.266:266",
                    descripcion:"Robo cometido cuando se aprovecha la falta de vigilancia o confunción ocasionada porun siniestro o un desorden."
                },
                {
                    clave:"Cve.275:275",
                    descripcion:"Robo en interior de vehículo automotor o recaiga sobre uno o más parte  que lo conforman  y se ejecuta con violencia."
                },
                {
                    clave:"Cve.280:280",
                    descripcion:"Robo en interior de vehículo automotor o recaiga sobre uno o más parte  que lo conforman  y se ejecuta con violencia."
                },
                {
                    clave:"Cve.300:300",
                    descripcion:"Robo en interior de vehículo automotor o recaiga sobre uno o más parte  que lo conforman  y se ejecuta con violencia."
                },
                {
                    clave:"Cve.301:301",
                    descripcion:"Robo en interior de vehículo automotor o recaiga sobre uno o más parte  que lo conforman  y se ejecuta con violencia."
                },
                {
                    clave:"Cve.310:310",
                    descripcion:"Robo en interior de vehículo automotor o recaiga sobre uno o más parte  que lo conforman  y se ejecuta con violencia."
                }
            ];

    buscar(value){
        this.optionLista=[];
        if (value.length>0){
            let n = this.dataList.length;
            for(let i=0; i<n; i++){
                if (this.dataList[i].clave.search(value)>-1 || this.dataList[i].descripcion.search(value)>-1){
                    this.optionLista.push(this.dataList[i]);
                }
            }
        }
            
        this.dataSource = new ExampleDataSource(this.optionLista);
        
    }

    agregar(e){
        this.addList.push(e);
        this.dataSourceaddList=new ExampleDataSource(this.addList);
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