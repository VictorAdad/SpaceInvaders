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
        overlayClickToClose: false, // Default: true
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
                    if(this.onLine.onLine){
                        this.http.get(`/v1/documentos/formatos/save/${_id}/${_format}`).subscribe(
                            response => {
                                console.log('Done changeFormat()', response);
                                this.setData(response);
                                this.globalService.openSnackBar("Formato generado con éxito");
                            }

                        );
                    }else{
                        this.formatos.replaceWord(
                            'F1-004 REGISTRO PRESENCIAL.docx',
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

    constructor(
        public dialogRef: MatDialogRef<SolPreDocComponent>,
        private _db: CIndexedDB,
        public globalService : GlobalService,
        private http: HttpService,
        @Inject(MAT_DIALOG_DATA) private data:any,){
        this.db=_db;
    }

    public uploader:FileUploader = new FileUploader({url: URL});
    public hasBaseDropZoneOver:boolean = false;
    public hasAnotherDropZoneOver:boolean = false;
    public isUploading: boolean = false;

    public archivos:any;

    public fileOverBase(e:any):void {
      this.hasBaseDropZoneOver = e;
      console.log("->",e);
    }

    close(){
        this.dialogRef.close();
    }

    fileEvent(e){

    }

    guardarOffLine(i:number,listaArchivos:any[]){
        //falta definir el guardado en la tabla de sincronizar
        var obj=this;
        if (i==listaArchivos.length){
            this.close();
            this.globalService.openSnackBar("Se guardo con éxito");
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
                        fecha:new Date()
                    };
                    obj.db.add("documentos",dato).then(t=>{
                        console.log("Se guardo el archivo",(item["some"])["name"]);
                        obj.guardarOffLine(i+1,listaArchivos);
                    });
                }
            );
        }
        reader.readAsDataURL(item["some"]);
    }

    public guardar(){
        console.log("-> Archivos:", this.uploader);
        console.log("-> Data:", this.data);
        var listaFiles = this.uploader.queue as any[];
        console.log('-> Files: ', listaFiles);

        for (let file of listaFiles) {
            this.data.formData.append('files', file['some']);
        }

        this.http.post(this.data.urlUpload, this.data.formData).subscribe(
            response => {
                console.log('Done guardar()', response);
                this.uploader.clearQueue();
                this.emitter.emit(response);
                this.close();
            }
        )
        // this.guardarOffLine(0,listaFiles);

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

