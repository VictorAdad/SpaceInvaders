import { Injectable } from '@angular/core';
import { HttpService} from '@services/http.service';
import * as JSZip from 'jszip';
import * as docxtemplater from 'docxtemplater';

@Injectable()
export class FormatosService {

	constructor(private http: HttpService) {
	}

    public replaceWord(_name:string, _pathFile: string, _data:any){
        this.http.getLocal(_pathFile).subscribe(
            response =>{
                console.log('-> Response', response);
                let doc = new docxtemplater();
                let reader = new FileReader();
                reader.onloadend = (file => {
                    console.log('-> Binary ', file);
                    let zip = new JSZip(file.target['result']);
                    doc.loadZip(zip);
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
                 });
                reader.readAsBinaryString(response);

            }
        );
    }

}