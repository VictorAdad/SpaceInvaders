import { Injectable } from '@angular/core';
import { HttpService} from '@services/http.service';
import * as JSZip from 'jszip';
import * as JSZipUtils from 'jszip-utils';
import * as docxtemplater from 'docxtemplater';

@Injectable()
export class FormatosService {

    public formatos =  new FormatosLocal();

	constructor(private http: HttpService) {
	}

    public getFormatos(){
        console.log('Formatos@getFormatos()');
        for(let attr in this.formatos){
            if(
                String(attr) !== 'constructor'
                ){
                JSZipUtils.getBinaryContent(this.formatos[attr].path, (error, response) => {
                    this.formatos[attr].file = new JSZip(response);
                });
            }
        }
        console.log(this.formatos);
    }

    public replaceWord(_name:string, _formato: string, _data:any){
        console.log('-> Response', this.formatos[_formato]);
        let doc = new docxtemplater();
        let reader = new FileReader();
        doc.loadZip(this.formatos[_formato].file);
        doc.setData(_data);
        try {
            // render the document (replace all occurences of {first_name} by John, {last_name} by Doe, ...)
            doc.render()
        }
        catch (error) {
            var e = {
                message: error.message,
                name: error.name,
                stack: error.stack,
                properties: error.properties,
            }
            console.log(JSON.stringify({error: e}));
            // The error thrown here contains additional information when logged with JSON.stringify (it contains a property object).
            throw error;
        }

        var out = doc.getZip().generate({
            type:"blob",
            mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        });
        let an  = document.createElement("a");
        let url = window.URL.createObjectURL(out);
        document.body.appendChild(an);
        an.href = url;
        an.download = _name;
        an.click();
    }

}

export class FormatosLocal {
    
    public F1_003 = {
        'path': '../../../../../assets/formatos/F1-004 REGISTRO PRESENCIAL.docx',
        'file': null
    };
    public F1_004= {
        'path': '../../../../../assets/formatos/F1-004 REGISTRO PRESENCIAL.docx',
        'file': null
    };
    public F1_005 = {
        'path': '../../../../../assets/formatos/F1-004 REGISTRO PRESENCIAL.docx',
        'file': null
    };

    constructor() {
        
    }
}