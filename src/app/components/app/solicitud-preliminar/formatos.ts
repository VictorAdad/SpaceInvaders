import { HttpService} from '@services/http.service';


export class FormatosGlobal{
	
    constructor(
        public http: HttpService
        ){

    }

    public changeFormat(_format, _id){
        console.log('Change format:', _format, _id);
        this.http.get(`/v1/documentos/formatos/save/${_id}/${_format}`).subscribe(
            response => {
                console.log('Done changeFormat()', response);
            }

        )

    }

    public downloadFile(_object, _contentType){
        console.log('downloadFile():', _object);
        this.http.getFile(`/v1/documentos/documento/${_object.uuidEcm}/${_contentType}`).subscribe(
            response => {
                console.log('Done downloadFile()', response);
                let blob = new Blob([response], { 
                    type: _contentType 
                });
                let an  = document.createElement("a");
                let url = window.URL.createObjectURL(response);
                document.body.appendChild(an);
                an.href = url;
                an.download = 'documento.pdf';
                an.click();
                // window.location.assign(url);
            }

        )
    }


}