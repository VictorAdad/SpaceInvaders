import { Component, Output, EventEmitter, Inject } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA} from '@angular/material';
import { CIndexedDB } from '@services/indexedDB';
import { HttpService} from '@services/http.service';
import { FileUploader, FileDropDirective, FileSelectDirective,FileUploaderOptions } from 'ng2-file-upload';
import { ConfirmationService } from '@jaspero/ng2-confirmations';
import { ResolveEmit,ConfirmSettings} from '@utils/alert/alert.service';
import { GlobalService } from "@services/global.service";
import { OnLineService } from '@services/onLine.service';
import { FormatosService } from '@services/formatos/formatos.service';
import { Observable } from 'rxjs/Observable';
import { Logger } from "@services/logger.service";
import { Yason } from "@services/utils/yason";
import { AuthenticationService } from '../../../services/auth/authentication.service';
import { CasoService } from '../../../services/caso/caso.service';

export class FormatosGlobal {
    public confirmation_settings: ConfirmSettings={
        overlay:true,
        overlayClickToClose: true, // Default: true
        showCloseButton: true, // Default: true
        confirmText: "Continuar", // Default: 'Yes'
        declineText: "Cancelar",
    };
    public formData: FormData;
    public urlUpload: string;
    public documentos: any = {};
    public vista:string="";
    /*
    atributo extra es para agregar un valor extra al formdata que se envia al sincronizar los atributos que tienen son nombre y valor.
    ejemplo de uso
    atributoExtraPost:{nombre:"predenuncia.id",valor:"104"}
    */
    public atributoExtraPost:any=null;

    constructor(
        public http: HttpService,
        public _confirmation: ConfirmationService,
        public globalService: GlobalService,
        public dialog: MatDialog,
        public onLine: OnLineService = null,
        public formatos: FormatosService = null,
        public auth: AuthenticationService =  null,
        public db: CIndexedDB =  null,
        public casoServ: CasoService = null
        ) {
        this.validateFiles();
    }

    public changeFormat(_format, _id, _data: any = {}) {
        Logger.log('Change format:', _format, _id);   

        this._confirmation.create('Advertencia','¿Estás seguro de guardar este formato?',this.confirmation_settings)
        .subscribe(
            (ans: ResolveEmit) => {
                if (ans.resolved) {
                    if (this.onLine === null || this.onLine.onLine) {
                        this.http.get(`/v1/documentos/formatos/save/${_id}/${_format}`).subscribe(
                            response => {
                                Logger.log('Done changeFormat()', response);
                                this.globalService.openSnackBar("Formato generado con éxito");
                                this.documentos[response.id] = response;
                                this.documentos[response.id]['validate'] = false;
                                this.setData(response);
                            },
                            error => {
                                this.globalService.openSnackBar("X ocurrió un error al generar el formato");
                            }
                        );
                    } else {
                        const tempId = Date.now();
                        const dato = {
                            url: `/v1/documentos/formatos/save/${_id}/${_format}`,
                            body: {},
                            options: [],
                            tipo: 'get',
                            pendiente: true,
                            dependeDe: [_id],
                            temId: tempId,
                            username: this.auth.user.username
                        };

                        this.db.add('sincronizar', dato).then( p => {
                        });
                        const out = this.formatos.replaceWord(
                            this.formatos.formatos[_format].nombre,
                            _format
                        );
                        if (this.auth) {
                            this.guardarFormatoOffLine(out, _id, this.formatos.formatos[_format].nameEcm);
                        }
                        const an  = document.createElement('a');
                        const url = window.URL.createObjectURL(out);
                        document.body.appendChild(an);
                        an.href = url;
                        an.download = this.formatos.formatos[_format].nombre;
                        an.click();
                    }

                }
            }
        );

    }


    public downloadFile(_object, _contentType){
        Logger.log('downloadFile():', _object);
        _contentType=_contentType.replace("/", "-");
        this.http.getFile(`/v1/documentos/documento/${_object.uuidEcm}/${_contentType}/${_object.tipo}`).subscribe(
            response => {
                Logger.log('Done downloadFile()', response);
                let blob = new Blob([response], {
                    type: _contentType
                });
                let an  = document.createElement("a");
                let url = window.URL.createObjectURL(response);
                document.body.appendChild(an);
                an.href = url;
                an.download = _object.nameEcm+'.'+_object.extension;
                an.click();
                // window.location.assign(url);
            }

        )
    }


    public validateFiles(){
        let timer = Observable.timer(2,2000);
        let subs = timer.subscribe( 
            t => {
                for (var key in this.documentos) {
                    Logger.log('validateFile()');
                    let doc = this.documentos[key];
                    let _contentType = doc.contentType.replace("/", "-");
                    this.http.getFile(`/v1/documentos/documento/${doc.uuidEcm}/${_contentType}/${doc.tipo}`).subscribe(
                        response => {
                            Logger.log('El archivo ya está generado');
                            this.documentos[key]['validate'] = true;
                            delete this.documentos[key];
                            
                        },
                        error => {
                            Logger.log('El archivo no está generado :(');

                        }
                    )
                    }
                }
        );
        
    }

    public openDocDialog() {
        var dialog = this.dialog.open(SolPreDocComponent, {
            height: 'auto',
            width: 'auto',
            panelClass:'file_chooser',
            backdropClass:'file_chooser_backdrop',
            id:'file_chooser',
            data: {
                urlUpload: this.urlUpload,
                formData: this.formData,
                vista:this.vista,
                atributoExtraPost:this.atributoExtraPost
            }
        });

        dialog.componentInstance.emitter.subscribe((archivos) => {
           Logger.log(archivos);
           this.cargaArchivos(archivos);
        });

    }

    public setData(_object){

    }

    public cargaArchivos(_archivos){

    }

    cargaArchivosOffline(object,procedimiento,ClassDocument){
      object.db.list("documentos").then(archivos=>{
        var lista=archivos as any[];
        Logger.logColor("------->","pink",lista, object);
        console.log(lista);
        object.data=[];
        object.dataSource = object.source;
        for (var i = 0; i < lista.length; ++i) {

          if (object.caso && lista[i]["casoId"]==object.caso.id && lista[i]["vista"]==object.vista){
            var obj=new ClassDocument();
            obj.id=lista[i]["id"];
            obj.nameEcm=lista[i]["nombre"];
            obj.procedimiento=procedimiento;
            obj.created=lista[i]["fecha"];
            obj["blob"]=lista[i]["idBlob"];
            obj["contentType"]=lista[i]["type"];
            object.data.push(obj);
            object.subject.next(object.data);
          }
        }
        Logger.logColor("------->","red",object.data);
      });
    }

    download(obj,row){
    Logger.logColor("Descargar","red",obj,row);
    if (!obj.onLine.onLine){
      Logger.logColor("0","red");
      obj.db.get("blobs",row.blob).then(t=>{
        Logger.logColor("1","red");
        var b=Yason.dataURItoBlob(t["blob"].split(',')[1], row.contentType );
        var a = document.createElement('a');
        a.download = row.nameEcm;
        a.href=window.URL.createObjectURL( b );
        a.onclick=function(e){
            Logger.log("Descargo archivo");
            document.body.removeChild(a);
        }
        a.target="_blank";
        document.body.appendChild(a);
        a.click();
        Logger.logColor("------>","pink",b, a);
      });
    }
  }


    public guardarFormatoOffLine(_file, _casoId, _format) {
        const reader = new FileReader();
        reader.onload = (file) => {
            this.db.add('blobs', {blob: file.target['result']}).then(
                t => {
                    const dato = {
                        nombre: _format,
                        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                        idBlob: t['id'],
                        procedimiento: '',
                        fecha: new Date(),
                        casoId: '',
                        vista: '',
                        atributoExtraPost: '',
                        tipo: 'formato-offline'
                    };
                    this.db.add('documentos', dato).then(doc => {
                        this.setData({
                            id: doc['id'],
                            nameEcm: doc['nombre'] + '.docx',
                            created: new Date(),
                            blob: doc['idBlob']
                        });
                    });
                }
            );
        };
        reader.readAsDataURL(_file);
    }


}

@Component({
    templateUrl: './documentos/component.html',
    styleUrls: ['./documentos/component.css']
})
export class SolPreDocComponent {

    private db: CIndexedDB
    @Output()
    emitter = new EventEmitter();
    public confirmation_settings:ConfirmSettings={
      overlayClickToClose: false, // Default: true
      showCloseButton: true, // Default: true
      confirmText: "Continuar", // Default: 'Yes'
      declineText: "Cancelar",
    };
    public isMaxCapacityViolated:boolean=false

    constructor(
        public dialogRef: MatDialogRef<SolPreDocComponent>,
        private _db: CIndexedDB,
        public globalService : GlobalService,
        private http: HttpService,
        @Inject(MAT_DIALOG_DATA) private data:any,
        public _confirmation:ConfirmationService,
        public dialog: MatDialog,
        public onLine: OnLineService = null,){
        this.db=_db;
    }
    public uploader:FileUploader = new FileUploader({url: URL});
    public hasBaseDropZoneOver:boolean = false;
    public hasAnotherDropZoneOver:boolean = false;
    public isUploading: boolean = false;
    public archivos:any;
    public formData: FormData;
    public urlUpload: string;

    public fileOverBase(e:any):void {
      this.hasBaseDropZoneOver = e;
      Logger.log("->",e);
      this.checkMaximunCapacity();

    }

    close(){
        this.dialogRef.close();
    }


    fileEvent(e){
      Logger.log('File Event has triggered!',e)
        //this.failFlag = true;
        this.checkMaximunCapacity();
    }
    checkMaximunCapacity(){
      let total_size=0;
      let  files =this.uploader.queue as any[];
      Logger.log("checking files maximun capacity", files);

      files.forEach(fileItem => {
        Logger.log(fileItem);
        total_size=total_size+fileItem.file.size;
        Logger.log('total_size',total_size);


      });
      Logger.log('total size',total_size/1048576);
      if(total_size/1048576>10){
        Logger.log("Maximun capacity violated");
        this.isMaxCapacityViolated=true;
      }
      else{
        this.isMaxCapacityViolated=false;
      }
    }
    public removeItem(item){
      Logger.log(item)
      this.uploader.removeFromQueue(item);
      this.checkMaximunCapacity();
    }

    guardarOffLine(i:number,listaArchivos:any[],casoId,_data){
        var obj=this;
        if (i==listaArchivos.length){
            //this.close();
            Logger.logColor("documentos offline","cyan");
            this.db.add("sincronizar",_data).then(p=>{
                this.globalService.openSnackBar("Se guardo con éxito")
            });
            this.uploader.clearQueue();
            this.emitter.emit(null);
            this.close();
            return;
        }
        let item=listaArchivos[i];
        var reader = new FileReader();
        reader.onload = function(){
            obj.db.add("blobs",{blob:reader.result}).then(
                t => {
                    var dato={
                        nombre:(item["some"])["name"],
                        type:(item["some"])["type"],
                        idBlob:t["id"],
                        procedimiento:"",
                        fecha:new Date(),
                        casoId:casoId,
                        vista:obj.data.vista,
                        atributoExtraPost:obj.data.atributoExtraPost
                    };
                    obj.db.add("documentos",dato).then(t=>{
                        Logger.log("Se guardo el archivo",(item["some"])["name"]);
                        _data["documentos"].push(t);
                        obj.guardarOffLine(i+1,listaArchivos,casoId,_data);
                    });
                }
            );
        }
        reader.readAsDataURL(item["some"]);
    }

    public guardar(){
        var obj=this;
     this._confirmation.create('Advertencia','¿Estás seguro de adjuntar este documento?',this.confirmation_settings)
      .subscribe(
          (ans: ResolveEmit) => {
              Logger.log("respueta",ans);
              if(ans.resolved){
                Logger.log("-> Archivos:", this.uploader);
                Logger.log("-> Data:", this.data);
                var listaFiles = this.uploader.queue as any[];
                Logger.log('-> Files to saves: ', listaFiles);
                this.data.formData.set('files',[]);
                for (let file of listaFiles) {
                    Logger.log('file',file)
                    this.data.formData.append('files', file['some']);
                }
                Logger.log(' A guardar!!', this.data.formData)
                if (this.onLine.onLine){
                    this.http.post(this.data.urlUpload, this.data.formData).subscribe(
                        response => {
                            Logger.log('Done guardar()', response);
                            this.archivos=response;
                            this.uploader.clearQueue();
                            this.emitter.emit(this.archivos);
                            this.close();
                        }
                    )
                }else{
                    let temId=Date.now();
                    let b=this.data.urlUpload.split("/")
                    let casoId=parseInt(b[b.length-1])
                    var dependeDe=[casoId];
                    if (obj.data.atributoExtraPost)
                        dependeDe.push(obj.data.atributoExtraPost["valor"]);
                    let dato={
                        url:this.data.urlUpload,
                        //hay que crear el body de los documentos
                        body:null,
                        options:[],
                        tipo:"postDocument",
                        pendiente:true,
                        dependeDe:dependeDe,
                        temId: temId,
                        documentos:[]
                    }
                    this.guardarOffLine(0,listaFiles,casoId,dato);
                }

              }
          }
      );

    }

    uploadFiles(){
        this.isUploading = true;
    }

    check(){
        if(this.uploader.isUploading){
            Logger.log('isUploading');
          }else{
            Logger.log('inNotUploading');
          }
    }

    public fileOverAnother(e:any):void {
      this.hasAnotherDropZoneOver = e;
    }
}

// const URL = '/api/';
const URL = 'https://evening-anchorage-3159.herokuapp.com/api/';

