import { Http } from '@angular/http';
import { FormatosGlobal } from './../../solicitud-preliminar/formatos';
import { Component, ViewChild, Output, Input, EventEmitter} from '@angular/core';
import { MatPaginator } from '@angular/material';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA} from '@angular/material';
import { TableService } from '@utils/table/table.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { SolicitudServicioPolicial } from '@models/solicitud-preliminar/solicitudServicioPolicial';
import { OnLineService } from '@services/onLine.service';
import { HttpService } from '@services/http.service';
import { _config } from '@app/app.config';
import { CIndexedDB } from '@services/indexedDB';
import { ConfirmationService } from '@jaspero/ng2-confirmations';
import { GlobalService } from "@services/global.service";
import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { TableDataSource } from './../../global.component';


@Component({
	selector: 'documento',
	templateUrl: './documento.component.html',
})
export class DocumentoComponent extends FormatosGlobal{

  id:number=null;
  displayedColumns = ['nombre','procedimiento', 'fechaCreacion'];
  object: any;
	dataSource: TableDataSource | null;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  public data: DocumentoPolicia[] = [];
  public subject:BehaviorSubject<DocumentoPolicia[]> = new BehaviorSubject<DocumentoPolicia[]>([]);
  public source:TableDataSource = new TableDataSource(this.subject);
  public formData:FormData = new FormData();
  public urlUpload: string;

  constructor(
      public http: HttpService,
      public confirmationService:ConfirmationService,
      public globalService:GlobalService,
      public dialog: MatDialog,
      private route: ActivatedRoute,
      private db: CIndexedDB,
      _onLine:OnLineService
      ){
      super(http, confirmationService, globalService, dialog,_onLine);
  }

  ngOnInit() {
    console.log('-> Object ', this.object);
    this.route.parent.params.subscribe(params => {
      console.log('id',params['id']);
            if(params['id']){
              console.log('iffff')
              this.id=params['id'];
              this.urlUpload = '/v1/documentos/casos/save/'+this.id;
              if (this.onLine.onLine){
                this.http.get('/v1/base/casos/'+this.id).subscribe(response=>{
                  this.object=response;
                  console.log('-> Object ', this.object);

                  if(this.object.documentos){
                      this.dataSource = this.source;
                      for (let object of this.object.documentos) {
                          this.data.push(object);
                          this.subject.next(this.data);
                      }

                  }
                  this.formData.append('caso.id', this.id.toString());

                });
              }else{
                this.cargaArchivosOffline();
              }
            }
      });

  }
  //convierte un archivo a blob
  dataURItoBlob(dataURI, type) {
    var binary = atob(dataURI);
    var array = [];
    for(var i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], {type: type});
  }

  cargaArchivosOffline(){
      this.db.list("documentos").then(archivos=>{
        var lista=archivos as any[];
        for (var i = 0; i < lista.length; ++i) {

          if (lista[i]["casoId"]==this.id){
            var obj=new DocumentoPolicia();
            obj.id=lista[i]["id"];
            obj.nameEcm=lista[i]["nombre"];
            obj.procedimiento="Caso";
            obj.created=lista[i]["fecha"];
            obj["blob"]=lista[i]["idBlob"];
            obj["contentType"]=lista[i]["type"];
            this.data.push(obj); 
          }
        }
        this.subject.next(this.data);
        this.dataSource = this.source;
      });
  }

  download(row){
    console.log(row);
    if (!this.onLine.onLine){
      this.db.get("blobs",row.blob).then(t=>{
        var b=this.dataURItoBlob(t["blob"].split(',')[1], row.contentType );
        var a = document.createElement('a');
        a.download = row.nameEcm;
        a.href=window.URL.createObjectURL( b );;
        a.click();
        a.remove();
      });
    }
  }







  public cargaArchivos(_archivos){
    let archivos=_archivos.saved

      for (let object of archivos) {
          this.data.push(object);
          this.subject.next(this.data);
      }
  }

  public setData(_object){
      console.log('setData()');
      this.data.push(_object);
      this.subject.next(this.data);
  }
  public mostrarOcultarFormatos(mostrar){
    if(mostrar){
      console.log("Mostrar formatos aquí")
    }
    else{
      console.log("Ocultar formatos aquí")

    }
  }
}

export class DocumentoPolicia {
	id: number
	nameEcm: string;
	procedimiento: string;
	created: Date;
}
