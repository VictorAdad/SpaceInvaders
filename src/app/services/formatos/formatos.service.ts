import { TipoInterviniente } from './../../models/catalogo/tipoInterviniente';
import { PersonaFisicaImputadoComponent } from './../../components/app/noticiaHecho/persona/create/persona-fisica-imputado.component';
import { Injectable } from '@angular/core';
import { HttpService} from '@services/http.service';
import * as JSZip from 'jszip';
import * as JSZipUtils from 'jszip-utils';
import * as docxtemplater from 'docxtemplater';
import { forEach } from '@angular/router/src/utils/collection';
import { environment } from '../../../environments/environment';
import { Logger } from "@services/logger.service";

@Injectable()
export class FormatosService {

    public formatos =  new FormatosLocal();

	constructor(private http: HttpService) {
	}

    public getFormatos(){
        // Logger.log('Formatos@getFormatos()');
        for(let attr in this.formatos){
            // Logger.log(attr);
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
        // Logger.log(this.formatos);
    }

    public replaceWord(_name:string, _formato: string){
        Logger.log('-> Response', this.formatos[_formato]);
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
            Logger.log(JSON.stringify({error: e}));
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
        'path': environment.app.host+'/assets/formatos/F1-003 LECTURA DE DERECHOS DE LA VÍCTIMA.docx',
        'nombre': 'F1-003 LECTURA DE DERECHOS DE LA VÍCTIMA.docx',
        'file': null,
        'data': null
    };
    public F1_004= {
        'path': environment.app.host+'/assets/formatos/F1-004 REGISTRO PRESENCIAL.docx',
        'nombre': 'F1-004 REGISTRO PRESENCIAL.docx',
        'file': null,
        'data': null
    };
    public F1_005 = {
        'path': environment.app.host+'/assets/formatos/F1-005 REGISTRO DE RECEPCIÓN DE LLAMADA.docx',
        'nombre': 'F1-005 REGISTRO DE RECEPCIÓN DE LLAMADA.docx',
        'file': null,
        'data': null
    };
  // Formato de entrevista
  public F1_008 = {
    'path': environment.app.host+'/assets/formatos/F1-008 ENTREVISTA.docx',
    'nombre': 'F1-008 ENTREVISTA.docx',
    'file': null,
    'data': null
   };
    // Formato de solicitud pericial
   public F1_009 = {
    'path': environment.app.host+'/assets/formatos/F1-009 OFICIO SOLICITUD A SERVICIOS PERICIALES.docx',
    'nombre': 'F1-009 OFICIO SOLICITUD A SERVICIOS PERICIALES.docx',
    'file': null,
    'data': null
   };
   public F1_010 = {
    'path': environment.app.host+'/assets/formatos/F1-010 SOLICITUD EXAMEN PSICOFÍSICO.docx',
    'nombre': 'F1-010 SOLICITUD EXAMEN PSICOFÍSICO.docx',
    'file': null,
    'data': null
   };
    // Formato de solicitud policia ministerial
   public F1_011 = {
    'path': environment.app.host+'/assets/formatos/F1-011 OFICIO SOLICITUD A POLICIA MINISTERIAL.docx',
    'nombre': 'F1-011 OFICIO SOLICITUD A POLICIA MINISTERIAL.docx',
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

         //F1008
        'xNombreAutoridadEntrevista': '',
        'xLugarEntrevista': '',
        'xNombreEntrevistado': '',
        'xEstadoMigratorio': '',
        'xTipoIdentificacion': '',
        'xEmisorIdentificacion': '',
        'xNumeroIdentificacion': '',
        'xSabeLeerEscribir': '',
        'xLugarOcupacion': '',
        'xSalarioSemanal': '',
        'xRelacionEntrevistadoPartes': '',
        'xCalle': '',
        'xNumExterior': '',
        'xNumInterior': '',
        'xColonia': '',
        'xCP': '',
        'xPoblacion': '',
        'xEstado': '',
        'xCorreoElectronico': '',
        'xRepresentanteLegal': '',
        'xNombreRepresentanteLegal': '',
        'xUsoMedioTecnologico': '',
        'xMedioTecnologico': '',
        'xUsoMedioTecnico': '',
        'xMedioTecnico': '',
        'xNombreEntrevistadoFirma': '',
        'xCargoEmisorFirma': '',
        'xNombreEmisorFirma': '',
        'xAdscripcionEmisorFirma': '',
        //F1009
        'xHechoDelictivo':'',
        'xOficio':'',
        'xImputado':'',
        'xMes':'',
        'xAnio':'',
        'xDia':'',
        'xSolicitaPerito':'',
        'xFinalidadRequerimiento':'',
        'xPlazoRendirInformes':'',
        'xApercibimiento':'',
        //F1010
        'xMedicoLegistaMayus':'',
        'xSolicitaExamen':'',
        'xRealizaraExamen':'',
       //F1011
         'xActuacionesSolicitadas':'',


      }

    constructor() {

    }

    public setDataF1003(_data){
        Logger.log('Formatos@setDataF1003', _data);
        this.setCasoInfo(_data);
        this.setVictimaInfo(_data);
        this.data['xFolioDocumento']     = !_data.predenuncias ? '' :(_data.predenuncias.noFolioConstancia ? _data.predenuncias.noFolioConstancia  : '');

        this.data['xHablaEspaniol']      = !_data.predenuncias ? '' :(_data.predenuncias.hablaEspaniol ? 'Sí' : 'No');
        this.data['xIdiomaLengua']       = !_data.predenuncias ? '' :(_data.predenuncias.hablaEspaniol ? '' : _data.predenuncias.lenguaIdioma);
        this.data['xInterprete']         = !_data.predenuncias ? '' :(_data.predenuncias.nombreInterprete ? _data.predenuncias.nombreInterprete  : '');
        this.data['xComprendioDerechos'] = !_data.predenuncias ? '' :(_data.predenuncias.compredioDerechos ? 'Sí' : 'No');
        this.data['xCopiaDerechos']      = !_data.predenuncias ? '' :(_data.predenuncias.proporcionoCopia ? 'Sí' : 'No');

        this.data['xCargoEmisor']        = '';
        this.data['xNombreEmisor']       = '';
        this.data['xAdscripcionEmisor']  = '';
    }

    public setDataF1004(_data){
        Logger.log('Formatos@setDataF1004', _data);
        this.setCasoInfo(_data);
        // this.data['xNombreUsuario']           = _data.

        this.data['xCalidadUsuarioPersona']   = _data.predenuncia ? _data.predenuncias.calidadPersona : '';
        this.data['xTipoPersona']             = _data.tipoPersona ? _data.tipoPersona.nombre : '';
        this.data['xNumeroTelefonico']        = _data.noTelefonico;
        this.data['xFolioIdentificacion']     = !_data.predenuncias ? '' :(_data.predenuncias.noFolioConstancia ? _data.predenuncias.noFolioConstancia  : '');
        this.data['xHechosNarrados']          = !_data.predenuncias ? '' :(_data.predenuncias.hechosNarrados ? _data.predenuncias.hechosNarrados  : '');
        this.data['xConclusionHechos']        = !_data.predenuncias ? '' :(_data.predenuncias.conclusion ? _data.predenuncias.conclusion  : '');
        this.data['xLugarHechos']             = !_data.predenuncias ? '' :(_data.predenuncias.lugarHechos ? _data.predenuncias.lugarHechos  : '');
        this.data['xCanalizacion']            = !_data.predenuncias ? '' :(_data.predenuncias.canalizacion ? _data.predenuncias.canalizacion  : '');
        this.data['xInstitucionCanalizacion'] = !_data.predenuncias ? '' :(_data.predenuncias.institucion ? _data.predenuncias.institucion  : '');
        this.data['xMotivoCanalizacion']      = !_data.predenuncias ? '' :(_data.predenuncias.motivoCanalizacion ? _data.predenuncias.motivoCanalizacion  : '');
        this.data['xFechaCanalizacion']       = !_data.predenuncias ? '' :(_data.predenuncias.fechaCanalizacion ? _data.predenuncias.fechaCanalizacion  : '');
        this.data['xHoraCanalizacion']        = !_data.predenuncias ? '' :(_data.predenuncias.horaCanalizacion ? _data.predenuncias.horaCanalizacion  : '');
        this.data['xNombreCausoHecho']        = !_data.predenuncias ? '' :(_data.predenuncias.nombreCausante ? _data.predenuncias.nombreCausante  : '');
        this.data['xDomicilioHechos']         = !_data.predenuncias ? '' :(_data.predenuncias.domicilioCausante ? _data.predenuncias.domicilioCausante  : '');
        this.data['xObservaciones']           = !_data.predenuncias ? '' :(_data.predenuncias.observaciones ? _data.predenuncias.observaciones  : '');
        // this.data['xPersonaRegistro']         = _data.
    }

    public setDataF1005(_data){
        this.setCasoInfo(_data);
        this.setVictimaInfo(_data);
        this.data['xTelefonoLlamando']      = !_data.predenuncias ? '' :(_data.predenuncias.noTelefonico ? _data.predenuncias.noTelefonico  : '');
        this.data['xTipoLineaTelefonica']   = !_data.predenuncias ? '' :(_data.predenuncias.tipoLinea ? _data.predenuncias.tipoLinea  : '');
        this.data['xLugarLlamada']          = !_data.predenuncias ? '' :(_data.predenuncias.lugarLlamada ? _data.predenuncias.lugarLlamada  : '');
        this.data['xNarracionHechos']       = !_data.predenuncias ? '' :(_data.predenuncias.hechosNarrados ? _data.predenuncias.hechosNarrados  : '');
        this.data['xAsesoria']              = !_data.predenuncias ? '' :(_data.predenuncias.comunicado ? _data.predenuncias.comunicado  : '');
        this.data['xHoraConclusionLlamada'] = !_data.predenuncias ? '' :(_data.predenuncias.horaConclusionLlamada ? _data.predenuncias.horaConclusionLlamada  : '');
        this.data['xDuracionLlamada']       = !_data.predenuncias ? '' :(_data.predenuncias.duracionLlamada ? _data.predenuncias.duracionLlamada  : '');
        this.data['xObservaciones']         = !_data.predenuncias ? '' :(_data.predenuncias.observaciones ? _data.predenuncias.observaciones  : '');
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



public setDataF1008(_data){
  Logger.log('Formatos@setDataF1008', _data);

  this.data['xNUC']= _data.nuc? _data.nuc:'';
  this.data['xNIC']= _data.nic? _data.nic:'';
  this.data['xFechaAtencion']=_data.created? _data.created:'';
  this.data['xHoraAtencion']= _data.created? _data.created:'';
  this.data['xNombreAutoridadEntrevista']= _data.autoridadRealizaEntrevista? _data.autoridadRealizaEntrevista:'';
  this.data['xLugarEntrevista']= _data.lugarRealizaEntrevista? _data.lugarRealizaEntrevista:'';
  this.data['xNombreEntrevistado']= _data.nombreEntrevistado? _data.nombreEntrevistado:'';
  this.data['xSexo']= _data.sexo? _data.sexo:'';
  this.data['xFechaNacimiento']= _data.fechaNacimiento? _data.fechaNacimiento:'';
  this.data['xNacionalidad']= _data.nacionalidad? _data.nacionalidad:'';
  this.data['xOriginario']= _data.originarioDe? _data.originarioDe:'';
  this.data['xEstadoMigratorio']= _data.estadoMigratorio? _data.estadoMigratorio:'';
  this.data['xCalidadUsuarioPersona']= '';
  this.data['xTipoIdentificacion']= _data.tipoIdentificacion? _data.tipoIdentificacion:'';
  this.data['xEmisorIdentificacion']= _data.emisorIdentificacion? _data.emisorIdentificacion:'';
  this.data['xNumeroIdentificacion']= _data.noIdentificacion? _data.noIdentificacion:'';
  this.data['xCURP']= _data.curp? _data.curp:'';
  this.data['xRFC']= _data.rfc? _data.rfc:'';
  this.data['xSabeLeerEscribir']= _data.sabeLeerEscribir? _data.sabeLeerEscribir:'';
  this.data['xEscolaridad']= _data.gradoEscolaridad? _data.gradoEscolaridad:'';
  this.data['xOcupacion']= _data.ocupacion? _data.ocupacion:'';
  this.data['xLugarOcupacion']= _data.lugarOcupacion? _data.lugarOcupacion:'';
  this.data['xEstadoCivil']= _data.estadoCivil? _data.estadoCivil:'';
  this.data['xSalarioSemanal']= _data.salarioSemanal? _data.salarioSemanal:'';
  this.data['xRelacionEntrevistadoPartes']=_data.relacionEntrevistado? _data.relacionEntrevistado:'';
  this.data['xCalle']= _data.calle? _data.calle:'';
  this.data['xNumExterior']= _data.noExterior? _data.noExterior:'';
  this.data['xNumInterior']= _data.noInterior? _data.noInterior:'';
  this.data['xColonia']= _data.colonia? _data.colonia:'';
  this.data['xCP']= _data.cp? _data.cp:'';
  this.data['xPoblacion']= _data.municipio? _data.municipio:'';
  this.data['xEstado']=_data.estado? _data.estado:'';
  this.data['xNumeroTelefonico']= _data.noTelefonoParticular? _data.noTelefonoParticular:'';
  this.data['xNumeroMovil']= _data.noTelefonoParticular? _data.noTelefonoParticular:'';
  this.data['xCorreoElectronico']= _data.correoElectronico? _data.correoElectronico:'';
  this.data['xRepresentanteLegal']= _data.tieneRepresentanteLegal?'Si':'No';
  this.data['xNombreRepresentanteLegal']= _data.nombreRepresentanteLegal? _data.nombreRepresentanteLegal:'';
  this.data['xUsoMedioTecnologico']= _data.medioTecnologicoUtilizado?'Si':'No';
  this.data['xMedioTecnologico']= _data.medioTecnologicoRegistro? _data.medioTecnologicoRegistro:'';
  this.data['xUsoMedioTecnico']= _data.medioTecnicoUtilizado?'Si':'No';
  this.data['xMedioTecnico']= _data.medioTecnicoRegistro? _data.medioTecnicoRegistro:'';
  this.data['xNarracionHechos']= _data.narracionHechos? _data.narracionHechos:'';
  this.data['xNombreEntrevistadoFirma']=  _data.nombreEntrevistado? _data.nombreEntrevistado:'';

  this.data['xCargoEmisorFirma']= '';
  this.data['xNombreEmisorFirma']= '';
  this.data['xAdscripcionEmisorFirma']= '';
}

public setDataF1009(_data,_id_solicitud){
  Logger.log('Formatos@setDataF1009', _data);
  let imputado;
  let victima = _data.findVictima();
  let nombreVictima =`${victima.persona.nombre} ${victima.persona.paterno} ${victima.persona.materno ? victima.persona.materno :'' }`;
  let lugar:any={};//por definir
  let pericial;

  _data.personaCasos.forEach(persona => {
    if(persona.tipoInterviniente.tipo==='Imputado'){
        imputado=persona;
        Logger.log(imputado)
    }

  });
  _data.solicitudPrePericiales.forEach(solicitud => {
     if(solicitud.id===_id_solicitud){
         pericial=solicitud;
     }
  });
  let nombreImputado = imputado.persona.nombre+' '+imputado.persona.paterno+' '+imputado.persona.materno;
  let date = new Date();
  if(pericial != null)
      date= new Date(pericial.created);

  this.data['xNUC']                     = _data.nuc? _data.nuc:'';
  this.data['xNIC']                     = _data.nic? _data.nic:'';
  this.data['xHechoDelictivo']          = _data.delitoPrincipal.nombre ? _data.delitoPrincipal.nombre : '';
  this.data['xVictima']                 = nombreVictima;
  this.data['xImputado']                = nombreImputado;
  this.data['xOficio']                  = pericial.hechosDenunciados ? _data.hechosDenunciados : '';
  this.data['xEstado']                  = lugar.estado?lugar.estado:lugar.estadoOtro?lugar.estadoOtro:'';
  this.data['xPoblacion']               = lugar.municipio? lugar.municipio:lugar.municipioOtro?lugar.municipioOtro:'';
  this.data['xDia']                     = date? date.getDay()+'' : '';
  this.data['xMes']                     = date? date.getMonth()+'' : '';
  this.data['xAnio']                    = date? date.getFullYear()+'' : '';
  this.data['xSolicitaPerito']          = pericial.peritoMateria ? pericial.peritoMateria: '';
  this.data['xFinalidadRequerimiento']  = pericial.finalidad?pericial.finalidad:'';
  this.data['xPlazoRendirInformes']     = pericial.plazoDias? pericial.plazoDias: '';
  this.data['xApercibimiento']          =  pericial.apercibimiento ? pericial.apercibimiento: '';
  this.data['xAdscripcionEmisor']        = '';

}

public setDataF1010(_data,_id_solicitud){
  Logger.log('Formatos@setDataF1010', _data);
  let imputado;
  let victima = _data.findVictima();
  let nombreVictima =`${victima.persona.nombre} ${victima.persona.paterno} ${victima.persona.materno ? victima.persona.materno :'' }`;
  let lugar:any={};//por definir
  let examen;

  _data.personaCasos.forEach(persona => {
    if(persona.tipoInterviniente.tipo==='Imputado'){
        imputado=persona;
        Logger.log(imputado)
    }
  });

  _data.solicitudPrePericiales.forEach(solicitud => {
     if(solicitud.id===_id_solicitud){
         examen=solicitud;
     }
  });
  let nombreImputado=imputado.persona.nombre+' '+imputado.persona.paterno+' '+imputado.persona.materno;
  let date= new Date(examen.created);
  this.data['xNUC']= _data.nuc? _data.nuc:'';
  this.data['xNIC']= _data.nic? _data.nic:'';
  this.data['xHechoDelictivo']     = _data.delitoPrincipal.nombre ? _data.delitoPrincipal.nombre : '';
  this.data['xVictima']       = nombreVictima;
  this.data['xImputado']      = nombreImputado;
  this.data['xOficio']        = examen.hechosDenunciados ? _data.hechosDenunciados : '';
  this.data['xEstado']        =lugar.estado?lugar.estado:lugar.estadoOtro?lugar.estadoOtro:'';
  this.data['xPoblacion']     = lugar.municipio? lugar.municipio:lugar.municipioOtro?lugar.municipioOtro:'';

  this.data['xDia'] = date? date.getDay()+'' : '';
  this.data['xMes']      = date? date.getMonth()+'' : '';
  this.data['xAnio']        = date? date.getFullYear()+'' : '';
  this.data['xApercibimiento'] =  examen.apercibimiento ? examen.apercibimiento: '';
  this.data['xMedicoLegistaMayus']        = examen.medicoLegista?examen.medicoLegista:'';
  this.data['xSolicitaExamen']        = examen.tipo? examen.tipo: '';
  this.data['xRealizaraExamen'] =  examen.realizadoA ? examen.realizadoA: '';
  this.data['xAdscripcionEmisor']  = '';

}



public setDataF1011(_data,_id_solicitud){
  Logger.log('Formatos@setDataF1010', _data);
  let imputado;
  let victima = _data.findVictima();
  let nombreVictima =`${victima.persona.nombre} ${victima.persona.paterno} ${victima.persona.materno ? victima.persona.materno :'' }`;
  let lugar:any={};//por definir
  let policia;

  _data.personaCasos.forEach(persona => {
    if(persona.tipoInterviniente.tipo==='Imputado'){
        imputado=persona;
        Logger.log(imputado)
    }
  });
  _data.solicitudPrePolicias.forEach(solicitud => {
     if(solicitud.id===_id_solicitud){
      policia=solicitud;
     }
  });
  let nombreImputado=imputado.persona.nombre+' '+imputado.persona.paterno+' '+imputado.persona.materno;
  let date = new Date();

  if(policia)
       date = new Date(policia.created);

  this.data['xNUC']                    = _data.nuc? _data.nuc:'';
  this.data['xNIC']                    = _data.nic? _data.nic:'';
  this.data['xHechoDelictivo']         = _data.delitoPrincipal.nombre ? _data.delitoPrincipal.nombre : '';
  this.data['xVictima']                = nombreVictima;
  this.data['xImputado']               = nombreImputado;
  this.data['xOficio']                 = typeof policia.hechosDenunciados != 'undefined' ? _data.hechosDenunciados : '';
  this.data['xEstado']                 =lugar.estado?lugar.estado:lugar.estadoOtro?lugar.estadoOtro:'';
  this.data['xPoblacion']              = lugar.municipio? lugar.municipio:lugar.municipioOtro?lugar.municipioOtro:'';
  this.data['xDia']                    = date? date.getDay()+'' : '';
  this.data['xMes']                    = date? date.getMonth()+'' : '';
  this.data['xAnio']                   = date? date.getFullYear()+'' : '';
  this.data['xActuacionesSolicitadas'] =  typeof policia.actuacionesSolicitadas != 'undefined' ? policia.actuacionesSolicitadas: '';
  this.data['xAdscripcionEmisor']      = '';
  Logger.log('formato',this.data)

}


}
