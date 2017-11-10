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
                String(attr) !== 'constructor',
                String(attr) !== 'data',
                String(attr) !== 'setDataF1004'
                ){
                JSZipUtils.getBinaryContent(this.formatos[attr].path, (error, response) => {
                    this.formatos[attr].file = new JSZip(response);
                });
            }
        }
        console.log(this.formatos);
    }

    public replaceWord(_name:string, _formato: string){
        console.log('-> Response', this.formatos[_formato]);
        let doc = new docxtemplater();
        let reader = new FileReader();
        doc.loadZip(this.formatos[_formato].file);
        doc.setData(this.formatos.data);
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
        'file': null,
        'data': null
    };
    public F1_004= {
        'path': '../../../../../assets/formatos/F1-004 REGISTRO PRESENCIAL.docx',
        'file': null,
        'data': null
    };
    public F1_005 = {
        'path': '../../../../../assets/formatos/F1-004 REGISTRO PRESENCIAL.docx',
        'file': null,
        'data': null
    };
    public data = {
        'xNUC': '',
        'xNIC': '',
        'xFechaAtencion': '',
        'xHoraAtencion': '',
        'xNombreUsuario': '',
        'xOriginario': '',
        'xEdad': '',
        'xSexo': '',
        'xDomicilio': '',
        'xCalidadUsuarioPersona': '',
        'xTipoPersona': '',
        'xFechaNacimiento': '',
        'xRFC': '',
        'xCURP': '',
        'xEstadoCivil': '',
        'xOcupacion': '',
        'xEscolaridad': '',
        'xReligion': '',
        'xNacionalidad': '',
        'xNumeroTelefonico': '',
        'xNumeroMovil': '',
        'xSeIdentificaCon': '',
        'xFolioIdentificacion': '',
        'xHechosNarrados': '',
        'xConclusionHechos': '',
        'xLugarHechos': '',
        'xCanalizacion': '',
        'xInstitucionCanalizacion': '',
        'xMotivoCanalizacion': '',
        'xFechaCanalizacion': '',
        'xHoraCanalizacion': '',
        'xNombreCausoHecho': '',
        'xDomicilioHechos': '',
        'xObservaciones': '',
        'xPersonaRegistro': '',
    }

    constructor() {
        
    }

    public setDataF1004(_data){
        console.log('Formatos@setDataF1004', _data);
        this.data['xNUC']                     = _data.nuc;
        this.data['xNIC']                     = _data.nic;
        this.data['xFechaAtencion']           = _data.created;
        this.data['xHoraAtencion']            = _data.created;
        // this.data['xNombreUsuario']           = _data.
        // this.data['xOriginario']              = _data.
        // this.data['xEdad']                    = _data.
        // this.data['xSexo']                    = _data.
        // this.data['xDomicilio']               = _data.
        this.data['xCalidadUsuarioPersona']   = _data.predenuncias.calidadPersona;
        this.data['xTipoPersona']             = _data.tipoPersona ? _data.tipoPersona.nombre : '';
        // this.data['xFechaNacimiento']         = _data.
        // this.data['xRFC']                     = _data.
        // this.data['xCURP']                    = _data.
        // this.data['xEstadoCivil']             = _data.
        // this.data['xOcupacion']               = _data.
        // this.data['xEscolaridad']             = _data.
        // this.data['xReligion']                = _data.
        // this.data['xNacionalidad']            = _data.
        // this.data['xNumeroTelefonico']        = _data.
        // this.data['xNumeroMovil']             = _data.
        // this.data['xSeIdentificaCon']         = _data.
        // this.data['xFolioIdentificacion']     = _data.
        // this.data['xHechosNarrados']          = _data.
        // this.data['xConclusionHechos']        = _data.
        // this.data['xLugarHechos']             = _data.
        // this.data['xCanalizacion']            = _data.
        // this.data['xInstitucionCanalizacion'] = _data.
        // this.data['xMotivoCanalizacion']      = _data.
        // this.data['xFechaCanalizacion']       = _data.
        // this.data['xHoraCanalizacion']        = _data.
        // this.data['xNombreCausoHecho']        = _data.
        // this.data['xDomicilioHechos']         = _data.
        // this.data['xObservaciones']           = _data.
        // this.data['xPersonaRegistro']         = _data.
    }
}