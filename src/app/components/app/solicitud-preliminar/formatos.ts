import { HttpService} from '@services/http.service';
import { ConfirmationService } from '@jaspero/ng2-confirmations';
import { ResolveEmit,ConfirmSettings} from '@utils/alert/alert.service';
import { GlobalService } from "@services/global.service";


export class FormatosGlobal{
	public confirmation_settings:ConfirmSettings={
    overlayClickToClose: false, // Default: true
    showCloseButton: true, // Default: true
    confirmText: "Continuar", // Default: 'Yes'
    declineText: "Cancelar",
    };
    constructor(
        public http: HttpService,
        public _confirmation:ConfirmationService,
        public globalService: GlobalService
        ){

    }

    public changeFormat(_format, _id){
      console.log('Change format:', _format, _id);

      this._confirmation.create('Advertencia','¿Estás seguro de guardar este formato?',this.confirmation_settings)
      .subscribe(
        (ans: ResolveEmit) => {
          console.log("respueta",ans);
          if(ans.resolved){
            this.http.get(`/v1/documentos/formatos/save/${_id}/${_format}`).subscribe(
                response => {
                    console.log('Done changeFormat()', response);
                    this.setData(response);
                    this.globalService.openSnackBar("Formato generado con éxito");
                }

            )

          }
        }
       );

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

    public setData(_object){

    }


}
