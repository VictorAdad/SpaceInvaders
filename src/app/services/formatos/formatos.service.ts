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
        'path': '../../../../../assets/formatos/F1-003 LECTURA DE DERECHOS DE LA VÍCTIMA.docx',
        'nombre': 'F1-003 LECTURA DE DERECHOS DE LA VÍCTIMA.docx',
        'file': null,
        'data': null
    };
    public F1_004= {
        'path': '../../../../../assets/formatos/F1-004 REGISTRO PRESENCIAL.docx',
        'nombre': 'F1-004 REGISTRO PRESENCIAL.docx',
        'file': null,
        'data': null
    };
    public F1_005 = {
        'path': '../../../../../assets/formatos/F1-005 REGISTRO DE RECEPCIÓN DE LLAMADA.docx',
        'nombre': 'F1-005 REGISTRO DE RECEPCIÓN DE LLAMADA.docx',
        'file': null,
        'data': null
    };
    public data = {
        //F1003
        'xFolioDocumento': '',
        'xVictima': '',
        'xHablaEspaniol': '',
        'xIdiomaLengua': '',
        'xInterprete': '',
        'xFolioVictima': '',
        'xCargoEmisor': '',
        'xNombreEmisor': '',
        'xAdscripcionEmisor': '',
        //F1004
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

    public setDataF1003(_data){
        console.log('Formatos@setDataF1003', _data);
        let victima = _data.findVictima();
        let nombreVictima = 
            `${victima.persona.nombre} ${victima.persona.paterno} ${victima.persona.materno ? victima.persona.materno :'' }`;
        this.data['xNUC']                = _data.nuc ? _data.nuc : '';
        this.data['xNIC']                = _data.nic ? _data.nic : '';
        this.data['xFechaAtencion']      = _data.created;
        this.data['xHoraAtencion']       = _data.created;
        this.data['xFolioDocumento']     = _data.predenuncias.noFolioConstancia ? _data.predenuncias.noFolioConstancia  : '';
        this.data['xVictima']            = nombreVictima;
        this.data['xHablaEspaniol']      = _data.predenuncias.hablaEspaniol ? 'Sí' : 'No';
        this.data['xIdiomaLengua']       = _data.predenuncias.hablaEspaniol ? '' : _data.predenuncias.lenguaIdioma;
        this.data['xInterprete']         = _data.predenuncias.nombreInterprete ? _data.predenuncias.nombreInterprete  : '';
        this.data['xComprendioDerechos'] = _data.predenuncias.compredioDerechos ? 'Sí' : 'No';
        this.data['xCopiaDerechos']      = _data.predenuncias.proporcionoCopia ? 'Sí' : 'No';
        this.data['xFolioVictima']       = victima.persona.folioIdentificacion ? victima.persona.folioIdentificacion : '';
        this.data['xCargoEmisor']        = '';
        this.data['xNombreEmisor']       = '';
        this.data['xAdscripcionEmisor']  = '';
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
        this.data['xNumeroTelefonico']        = _data.noTelefonico;
        // this.data['xNumeroMovil']             = _data.
        // this.data['xSeIdentificaCon']         = _data.
        this.data['xFolioIdentificacion']     = _data.predenuncias.noFolioConstancia ? _data.predenuncias.noFolioConstancia  : '';
        this.data['xHechosNarrados']          = _data.predenuncias.hechosNarrados ? _data.predenuncias.hechosNarrados  : '';
        this.data['xConclusionHechos']        = _data.predenuncias.conclusion ? _data.predenuncias.conclusion  : '';
        this.data['xLugarHechos']             = _data.predenuncias.lugarHechos ? _data.predenuncias.lugarHechos  : '';
        this.data['xCanalizacion']            = _data.predenuncias.canalizacion ? _data.predenuncias.canalizacion  : '';
        this.data['xInstitucionCanalizacion'] = _data.predenuncias.institucion ? _data.predenuncias.institucion  : '';
        this.data['xMotivoCanalizacion']      = _data.predenuncias.motivoCanalizacion ? _data.predenuncias.motivoCanalizacion  : '';
        this.data['xFechaCanalizacion']       = _data.predenuncias.fechaCanalizacion ? _data.predenuncias.fechaCanalizacion  : '';
        this.data['xHoraCanalizacion']        = _data.predenuncias.horaCanalizacion ? _data.predenuncias.horaCanalizacion  : '';
        this.data['xNombreCausoHecho']        = _data.predenuncias.nombreCausante ? _data.predenuncias.nombreCausante  : '';
        this.data['xDomicilioHechos']         = _data.predenuncias.domicilioCausante ? _data.predenuncias.domicilioCausante  : '';
        this.data['xObservaciones']           = _data.predenuncias.observaciones ? _data.predenuncias.observaciones  : '';
        // this.data['xPersonaRegistro']         = _data.
    }

}