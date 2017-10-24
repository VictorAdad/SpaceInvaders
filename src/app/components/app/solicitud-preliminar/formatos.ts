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


}