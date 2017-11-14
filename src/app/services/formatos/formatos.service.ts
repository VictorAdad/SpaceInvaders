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
            console.log(attr);
            if(
                String(attr) !== 'constructor',
                String(attr) !== 'data',
                String(attr) !== 'setDataF1003',
                String(attr) !== 'setDataF1004',
                String(attr) !== 'setDataF1005',
                String(attr) !== 'setCasoInfo',
                String(attr) !== 'setVictimaInfo'
                ){
                if(this.formatos[attr].path){
                    JSZipUtils.getBinaryContent(this.formatos[attr].path, (error, response) => {
                        this.formatos[attr].file = new JSZip(response);
                    });
                }
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
        //F1005
        'xTipoLineaTelefonica': '',
        'xTelefonoLlamando': '',
        'xLugarLlamada': '',
        'xNarracionHechos': '',
        'xAsesoria': '',
        'xHoraConclusionLlamada': '',
        'xDuracionLlamada': '',
        'xOrientadorJuridico': '',
    }

    constructor() {
        
    }

    public setDataF1003(_data){
        console.log('Formatos@setDataF1003', _data);
        this.setCasoInfo(_data);
        this.setVictimaInfo(_data);
        this.data['xFolioDocumento']     = _data.predenuncias.noFolioConstancia ? _data.predenuncias.noFolioConstancia  : '';
        
        this.data['xHablaEspaniol']      = _data.predenuncias.hablaEspaniol ? 'Sí' : 'No';
        this.data['xIdiomaLengua']       = _data.predenuncias.hablaEspaniol ? '' : _data.predenuncias.lenguaIdioma;
        this.data['xInterprete']         = _data.predenuncias.nombreInterprete ? _data.predenuncias.nombreInterprete  : '';
        this.data['xComprendioDerechos'] = _data.predenuncias.compredioDerechos ? 'Sí' : 'No';
        this.data['xCopiaDerechos']      = _data.predenuncias.proporcionoCopia ? 'Sí' : 'No';
        
        this.data['xCargoEmisor']        = '';
        this.data['xNombreEmisor']       = '';
        this.data['xAdscripcionEmisor']  = '';
    }

    public setDataF1004(_data){
        console.log('Formatos@setDataF1004', _data);
        this.setCasoInfo(_data);
        // this.data['xNombreUsuario']           = _data.
        
        this.data['xCalidadUsuarioPersona']   = _data.predenuncias.calidadPersona;
        this.data['xTipoPersona']             = _data.tipoPersona ? _data.tipoPersona.nombre : '';
        this.data['xNumeroTelefonico']        = _data.noTelefonico;
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

    public setDataF1005(_data){
        this.setCasoInfo(_data);
        this.setVictimaInfo(_data);
        this.data['xTelefonoLlamando']      = _data.predenuncias.noTelefonico ? _data.predenuncias.noTelefonico  : '';
        this.data['xTipoLineaTelefonica']   = _data.predenuncias.tipoLinea ? _data.predenuncias.tipoLinea  : '';
        this.data['xLugarLlamada']          = _data.predenuncias.lugarLlamada ? _data.predenuncias.lugarLlamada  : '';
        this.data['xNarracionHechos']       = _data.predenuncias.hechosNarrados ? _data.predenuncias.hechosNarrados  : '';
        this.data['xAsesoria']              = _data.predenuncias.comunicado ? _data.predenuncias.comunicado  : '';
        this.data['xHoraConclusionLlamada'] = _data.predenuncias.horaConclusionLlamada ? _data.predenuncias.horaConclusionLlamada  : '';
        this.data['xDuracionLlamada']       = _data.predenuncias.duracionLlamada ? _data.predenuncias.duracionLlamada  : '';
        this.data['xObservaciones']         = _data.predenuncias.observaciones ? _data.predenuncias.observaciones  : '';
        this.data['xAdscripcionEmisor']     = ''
        this.data['xOrientadorJuridico']    = ''
    }

    public setCasoInfo(_caso){
        this.data['xNUC']           = _caso.nuc ? _caso.nuc : '';
        this.data['xNIC']           = _caso.nic ? _caso.nic : '';
        this.data['xFechaAtencion'] = _caso.formatCreated();
        this.data['xHoraAtencion']  = _caso.formatHoraCreated();
    }

    public setVictimaInfo(_caso){
        let victima = _caso.findVictima();
        let nombreVictima = 
            `${victima.persona.nombre} ${victima.persona.paterno} ${victima.persona.materno ? victima.persona.materno :'' }`;
        this.data['xVictima']         = nombreVictima;
        this.data['xFolioVictima']    = victima.persona.folioIdentificacion ? victima.persona.folioIdentificacion : '';
        this.data['xSeIdentificaCon'] = _caso.getAlias(victima);
        this.data['xDomicilio']       = _caso.getDomicilios(victima);
        this.data['xOriginario']      = victima.persona.pais ? victima.persona.pais.nombre : '';
        this.data['xEdad']            = victima.persona.edad;
        this.data['xSexo']            = victima.persona.sexo.nombre;
        this.data['xFechaNacimiento'] = _caso.formatFecha(victima.personafechaNacimiento);
        this.data['xRFC']             = victima.persona.rfc ? victima.persona.rfc : '';
        this.data['xCURP']            = victima.persona.curp ? victima.persona.curp : '';
        this.data['xEstadoCivil']     = victima.persona.estadoCivil ? victima.persona.estadoCivil.nombre : '';
        this.data['xOcupacion']       = victima.persona.ocupacion ? victima.persona.ocupacion.nombre : ''    ;
        this.data['xEscolaridad']     = victima.persona.escolaridad ? victima.persona.escolaridad.nombre : '';
        this.data['xReligion']        = victima.persona.nacionalidadReligion ? victima.persona.nacionalidadReligion.religion : '';
        this.data['xNacionalidad']    = victima.persona.nacionalidadReligion ? victima.persona.nacionalidadReligion.nacionalidad : '';
        this.data['xNumeroMovil']     = ''
        this.data['xNumeroTelefonico']     = ''
    }



}