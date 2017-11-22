import { Component, Output, EventEmitter, Inject } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA} from '@angular/material';
import { CIndexedDB } from '@services/indexedDB';
import { HttpService} from '@services/http.service';
import { FileUploader, FileDropDirective, FileSelectDirective } from 'ng2-file-upload';
import { ConfirmationService } from '@jaspero/ng2-confirmations';
import { ResolveEmit,ConfirmSettings} from '@utils/alert/alert.service';
import { GlobalService } from "@services/global.service";
import { OnLineService } from '@services/onLine.service';
import { FormatosService } from '@services/formatos/formatos.service';


export class FormatosGlobal{
	public confirmation_settings:ConfirmSettings={
        overlay:true,
        overlayClickToClose: true, // Default: true
        showCloseButton: true, // Default: true
        confirmText: "Continuar", // Default: 'Yes'
        declineText: "Cancelar",
    };
    public formData: FormData;
    public urlUpload: string;

    constructor(
        public http: HttpService,
        public _confirmation:ConfirmationService,
        public globalService: GlobalService,
        public dialog: MatDialog,
        public onLine: OnLineService = null,
        public formatos: FormatosService = null
        ){

    }

    public changeFormat(_format, _id, _data: any = {}){
        console.log('Change format:', _format, _id);

        this._confirmation.create('Advertencia','¿Estás seguro de guardar este formato?',this.confirmation_settings)
        .subscribe(
            (ans: ResolveEmit) => {
                console.log("respueta",ans);
                if(ans.resolved){
                    if(this.onLine === null || this.onLine.onLine){
                        this.http.get(`/v1/documentos/formatos/save/${_id}/${_format}`).subscribe(
                            response => {
                                console.log('Done changeFormat()', response);
                                this.setData(response);
                                this.globalService.openSnackBar("Formato generado con éxito");
                            }

                        );
                    }else{
                        this.formatos.replaceWord(
                            this.formatos.formatos[_format].nombre,
                            _format
                        )
                    }

                }
            }
        );

    }


    public downloadFile(_object, _contentType){
        console.log('downloadFile():', _object);
        _contentType=_contentType.replace("/", "-");
        this.http.getFile(`/v1/documentos/documento/${_object.uuidEcm}/${_contentType}/${_object.tipo}`).subscribe(
            response => {
                console.log('Done downloadFile()', response);
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

    public openDocDialog() {
        var dialog = this.dialog.open(SolPreDocComponent, {
            height: 'auto',
            width: 'auto',
            data: {
                urlUpload: this.urlUpload,
                formData: this.formData
            }
        });

        dialog.componentInstance.emitter.subscribe((archivos) => {
           console.log(archivos);
           this.cargaArchivos(archivos);
        });

    }

    public setData(_object){

    }

    public cargaArchivos(_archivos){

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
      console.log("->",e);
    }

    close(){
        this.dialogRef.close();
    }


    fileEvent(e){

    }

    guardarOffLine(i:number,listaArchivos:any[],casoId,_data){
        //falta definir el guardado en la tabla de sincronizar
        var obj=this;
        if (i==listaArchivos.length){
            //this.close();
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
                        casoId:casoId
                    };
                    obj.db.add("documentos",dato).then(t=>{
                        console.log("Se guardo el archivo",(item["some"])["name"]);
                        _data["documentos"].push(t);
                        obj.guardarOffLine(i+1,listaArchivos,casoId,_data);
                    });
                }
            );
        }
        reader.readAsDataURL(item["some"]);
    }

    public guardar(){
      this.close();
      this._confirmation.create('Advertencia','¿Estás seguro de adjuntar este documento?',this.confirmation_settings)
      .subscribe(
          (ans: ResolveEmit) => {
              console.log("respueta",ans);
              if(ans.resolved){
                console.log("-> Archivos:", this.uploader);
                console.log("-> Data:", this.data);
                var listaFiles = this.uploader.queue as any[];
                console.log('-> Files to saves: ', listaFiles);
                this.data.formData.set('files',[]);
                for (let file of listaFiles) {
                    console.log('file',file)
                    this.data.formData.append('files', file['some']);
                }
                console.log(' A guardar!!', this.data.formData)
                if (this.onLine.onLine){
                    this.http.post(this.data.urlUpload, this.data.formData).subscribe(
                        response => {
                            console.log('Done guardar()', response);
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
                    let dato={
                        url:this.data.urlUpload,
                        //hay que crear el body de los documentos
                        body:null,
                        options:[],
                        tipo:"postDocument",
                        pendiente:true,
                        dependeDe:[casoId],
                        temId: temId,
                        documentos:[]
                    }
                    this.guardarOffLine(0,listaFiles,casoId,dato);
                }

              }
              else{
                var dialog = this.dialog.open(SolPreDocComponent, {
                  height: 'auto',
                  width: 'auto',
                  data: {
                    urlUpload: this.urlUpload,
                    formData: this.formData
                }
              });
              }
          }
      );

    }

    uploadFiles(){
        this.isUploading = true;
    }

    check(){
        if(this.uploader.isUploading){
            console.log('isUploading');
          }else{
            console.log('inNotUploading');
          }
    }

    public fileOverAnother(e:any):void {
      this.hasAnotherDropZoneOver = e;
    }
}

// const URL = '/api/';
const URL = 'https://evening-anchorage-3159.herokuapp.com/api/';

