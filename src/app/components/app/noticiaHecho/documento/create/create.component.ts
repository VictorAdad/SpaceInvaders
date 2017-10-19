import { Component } from '@angular/core';
import { FileUploader, FileDropDirective, FileSelectDirective } from 'ng2-file-upload';
import { MatDialogRef } from '@angular/material';
import { CIndexedDB } from '@services/indexedDB';

@Component({
    templateUrl: './create.component.html',
    styleUrls: ['./create.component.css']
})

export class DocumentoCreateComponent {

    private db: CIndexedDB    

    constructor(public dialogRef: MatDialogRef<DocumentoCreateComponent>, 
        private _db: CIndexedDB){
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
            return;
        }
        let item=listaArchivos[i];
        var reader = new FileReader();
        reader.onload = function(){
            obj.db.add("blobs",{blob:reader.result}).then(t=>{
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
            });
        }
        reader.readAsDataURL(item["some"]);
    }

    guardar(){
        console.log("archivos:",this.uploader);
        var listaFiles=this.uploader.queue;
        this.guardarOffLine(0,listaFiles);
        
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