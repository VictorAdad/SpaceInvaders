import { Component } from '@angular/core';
import { FileUploader, FileDropDirective, FileSelectDirective } from 'ng2-file-upload';
import { MdDialogRef } from '@angular/material';

@Component({
    templateUrl: './create.component.html',
    styleUrls: ['./create.component.css']
})

export class DocumentoCreateComponent {

    constructor(public dialogRef: MdDialogRef<DocumentoCreateComponent>){}

    public uploader:FileUploader = new FileUploader({url: URL});
    public hasBaseDropZoneOver:boolean = false;
    public hasAnotherDropZoneOver:boolean = false;
    public isUploading: boolean = false;
   
    public fileOverBase(e:any):void {
      this.hasBaseDropZoneOver = e;
      //this.uploader.uploadAll();
      //this.dialogRef.close();
      //this.check();
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