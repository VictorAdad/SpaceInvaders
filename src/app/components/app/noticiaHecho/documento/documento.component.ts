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
import { Logger } from "@services/logger.service";


@Component({
	selector: 'documento',
	templateUrl: './documento.component.html',
})
export class DocumentoComponent extends FormatosGlobal{


  id:number=null;
  displayedColumns = ['nombre','procedimiento', 'fechaCreacion'];
  object: any;
  public dataSource: TableService | null;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  public pag: number = 0;
  public data: DocumentoNoticia[] = [];
  public subject:BehaviorSubject<DocumentoNoticia[]> = new BehaviorSubject<DocumentoNoticia[]>([]);
  public source:TableDataSource = new TableDataSource(this.subject);
  public formData:FormData = new FormData();
  public urlUpload: string;
  public pageSize:number=10;
  public pageIndex:number=0;
  public isShowAll:boolean=false;
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
    Logger.log('-> Object ', this.object);
    this.route.parent.params.subscribe(params => {
      Logger.log('id',params['id']);
            if(params['id']){
              Logger.log('iffff')
              this.id=params['id'];
              this.urlUpload = '/v1/documentos/casos/save/'+this.id;
              if (this.onLine.onLine){
                this.page('/v1/documentos/casos/'+this.id+'/page?p='+this.pageIndex+'&tr='+this.pageSize);

                this.http.get('/v1/base/casos/'+this.id).subscribe(response=>{
                  this.object=response;
                  this.data=this.object.documentos
                  Logger.log('-> Object ', this.object);

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
        console.log(lista);
        this.data=[];
        for (var i = 0; i < lista.length; ++i) {

          if (lista[i]["casoId"]==this.id){
            var obj=new DocumentoNoticia();
            obj.id=lista[i]["id"];
            obj.nameEcm=lista[i]["nombre"];
            obj.procedimiento="Caso";
            obj.created=lista[i]["fecha"];
            obj["blob"]=lista[i]["idBlob"];
            obj["contentType"]=lista[i]["type"];
            this.data.push(obj);
          }
        }
        let data_slice=this.data;
        if(this.pageSize*this.pageIndex+this.pageSize<=this.data.length)
        {
          this.dataSource = new TableService(this.paginator, data_slice.slice(this.pageSize*this.pageIndex,this.pageSize));}
       else{
       this.dataSource = new TableService(this.paginator, data_slice.slice(this.pageSize*this.pageIndex,this.data.length));
        }
        this.pag = this.data.length;
      });
  }

  download(row){
    Logger.log(row);
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
    if(_archivos){
    Logger.log('cargando archivos',_archivos)
    let archivos=_archivos.saved
     for (let object of archivos) {
          this.data.push(object);
          this.subject.next(this.data);
      }
      let data_slice=this.data;
      Logger.log(this.data);
      if(this.pageSize*this.pageIndex+this.pageSize<=this.data.length)
      this.dataSource = new TableService(this.paginator, data_slice.slice(this.pageSize*this.pageIndex,this.pageSize));
     else{
     this.dataSource = new TableService(this.paginator, data_slice.slice(this.pageSize*this.pageIndex,this.data.length));
      }
      Logger.log(this.data.length);
      this.pag = this.pag+_archivos.saved.length;
    }else{
      this.cargaArchivosOffline();
    }
  }

  public setData(_object){
      Logger.log('setData()');
      this.data.push(_object);
      this.subject.next(this.data);
      this.dataSource = new TableService(this.paginator, this.data);
      this.pag = this.data.length;
  }
  public mostrarOcultarTodos(showAll){
    if(showAll.checked){
      this.isShowAll=true;
     this.data= [];
      Logger.log('mostrar',showAll);
      this.http.get('/v1/base/casos/'+this.id+'/documentos').subscribe((response) => {
       Logger.log(response)
       let keys= Object.keys(response)
       keys.forEach(key=> {
          Logger.log(response[key]);
          let documentArray=response[key];
          let procedimiento= this.procedimientoByKey(key);
          documentArray.forEach(document => {
            document.procedimiento=procedimiento
            Logger.log(document)
            this.data.push(document);
          });
          });
          this.pag = this.data.length;
          let data_slice=this.data;
          if(this.pageSize*this.pageIndex+this.pageSize<=this.data.length)
            this.dataSource = new TableService(this.paginator, data_slice.slice(this.pageSize*this.pageIndex,this.pageSize*this.pageIndex+this.pageSize));
          else{
            this.dataSource = new TableService(this.paginator, data_slice.slice(this.pageSize*this.pageIndex,this.data.length));
           }
      });
    }
    else{
      this.pageIndex=0;
      this.page('/v1/documentos/casos/'+this.id+'/page?p='+this.pageIndex+'&tr='+this.pageSize);
      this.isShowAll=false;
    }

  }
  public procedimientoByKey(key: any): any {
    let procedimiento='';

    switch (key) {
      case 'DocAcuerdo':
      procedimiento= 'Acuerdos';
      break;
      case 'DocArchivoTemporal':
      procedimiento= 'Archivo temporal';
      break;
      case 'DocEntrevista':
      procedimiento= 'Entrevista';
      break;
      case 'DocFacultadNoInvestigar':
      procedimiento= 'Facultad de no investigar';
      break;
      case 'DocNic':
      procedimiento= 'NIC';
      break;
      case 'DocNoEjercicioAccion':
      procedimiento= 'No ejercicio de acción penal';
      break;
      case 'DocPredenuncia':
      procedimiento= 'Predenuncia';
      break;
      case 'DocSolPreAcuerdo':
      procedimiento= 'Solicitudes y acuerdos generales';
      break;
      case 'DocSolPreInspeccion':
      procedimiento= 'Inspecciones';
      break;
      case 'DocSolPrePericial':
      procedimiento= 'Solicitudes a periciales';
      break;
      case 'DocSolPrePolicia':
      procedimiento= 'Solicitudes a policía ministerial';
      break;
      case 'DocSolPreRegistro':
      procedimiento= 'Registro general';
      break;
      case 'DocSolPreReqInfo':
      procedimiento= 'Requerimiento de información';
      break;
      default:
        break;
    }
    return procedimiento;
  }

  public changePage(_e){
    this.pageIndex= _e.pageIndex;
    this.pageSize=_e.pageSize;
    Logger.log('page index',this.pageIndex)
    if(!this.isShowAll){
      if(this.onLine.onLine){
         this.page('/v1/documentos/casos/'+this.id+'/page?p='+_e.pageIndex+'&tr='+_e.pageSize);
      }
      else{
        let data_slice=this.data;
        console.log(this.data.length)
        Logger.log(data_slice.slice(this.pageSize*this.pageIndex,this.pageSize))
        if(this.pageSize*this.pageIndex+this.pageSize<=this.data.length)
        this.dataSource = new TableService(this.paginator, data_slice.slice(this.pageSize*this.pageIndex,this.pageSize*this.pageIndex+this.pageSize));
        else{
         this.dataSource = new TableService(this.paginator, data_slice.slice(this.pageSize*this.pageIndex,this.data.length));
        }
      }
    }else{
      let data_slice=this.data;
      Logger.log(data_slice.slice(this.pageSize*this.pageIndex,this.pageSize))
      if(this.pageSize*this.pageIndex+this.pageSize<=this.data.length)
      this.dataSource = new TableService(this.paginator, data_slice.slice(this.pageSize*this.pageIndex,this.pageSize*this.pageIndex+this.pageSize));
      else{
       this.dataSource = new TableService(this.paginator, data_slice.slice(this.pageSize*this.pageIndex,this.data.length));
      }
    }


}

	public page(url: string) {
		this.data = [];
		this.http.get(url).subscribe((response) => {
			response.data.forEach(object => {
				this.pag = response.totalCount;
				this.data.push(object);
				this.dataSource = new TableService(this.paginator, this.data);
			});
			Logger.log('Datos finales', this.dataSource);
		});
	}

}

export class DocumentoNoticia{
	id: number
	nameEcm: string;
	procedimiento: string;
	created: Date;
}
