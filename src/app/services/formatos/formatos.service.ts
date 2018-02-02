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
import * as moment from 'moment';

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

    public replaceWord(_name:string, _formato: string, _data=null){
        Logger.log('-> Response', this.formatos[_formato]);
        let doc = new docxtemplater();
        let reader = new FileReader();
        doc.loadZip(this.formatos[_formato].file);
        if (_data != null) {
            console.log('<<< hola mundo  >>>', _data);
            doc.setData(_data);

        } else {
            doc.setData(this.formatos.data);
        }
        console.log('<<< replaceWod >>>', this.formatos.data);
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
   //Formado de Informe Policial Homologado
   public F1_IPH = {
    'path': environment.app.host+'/assets/formatos/IPH.docx',
    'nombre': 'IPH.docx',
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

        //IPH
        'xNumeroReferencia': '',
        'xPrimerResponsable': '',
        'xInstitucion': '',
        'xMunicipio': '',
        'xCuip': '',
        // 2
        'xEnteroHecho': '',
        'xEspecifique': '',
        'xFechaConocimiento': '',
        'xHoraConocimiento': '',
        // 3
        'xFechaArribo': '',
        'xHoraArribo': '',
        'xEntidadArribo': '',
        'xMunicipioArribo': '',
        'xLocalidadArribo': '',
        'xCalleArribo': '',
        'xNumIntArribo': '',
        'xNumExtArribo': '',
        'xEntreCalleArribo': '',
        'xTramoCarreteroArribo': '',
        'xTipoArribo': '',
        'xKmArribo': '',
        'xLatitudArribo': '',
        'xLongitudArribo': '',
        'xRiesgoPara': '',
        'xTipoRiesgo': '',
        'xEspecifiqueRiesgo': '',
        'xApoyo': '',
        'xNumEconomico': '',
        'xEspecifiqueApoyo': '',
        'xNarracionHechosResponsable': '',
        //radios
        'xProteccion': '',
        'xRecepcionAcciones': '',
        'xRecoleccionAcciones': '',
        'xProteccionAcciones': '',
        'xResguardoAcciones': '',
        'xPreservacionAcciones': '',
        'xInformarAcciones': '',
        'xProteccionAccionesA': '',
        'xResguardoAccionesA': '',
        'xDetencionAcciones': '',
        'xFuerzaAcciones': '',
        'xPuestoAcciones': '',
        'xInventarioAcciones': '',
        'xTrasladoAcciones': '',
        'xInspeccionesAcciones': '',
        'xEchosFavorAcciones':'',
        'xTrasladoAccionesA':'',
        'xTrasladoAccionesDe':'',
        'xInspeccionesAccionesA':'',
        'xEntrevistasAcciones':'',
        // 4
        'xFechaPreservacion': '',
        'xHoraPreservacion': '',
        'xAcordonamiento': '',
        'xCuipAcordonamiento': '',
        'xPaternoAcordonamiento': '',
        'xMaternoAcordonamiento': '',
        'xNombreAcordonamiento': '',
        'xAdcripcionAcordonamiento': '',
        'xResguardo': '',
        'xCuipResguardo': '',
        'xPaternoResguardo': '',
        'xMaternoResguardo': '',
        'xNombreResguardo': '',
        'xAdcripcionResguardo': '',
        // 5
        'xFechaCertificado': '',
        'xHoraCertificado': '',
        'xMedico': '',
        'xMedicoAgencia': '',
        'xNombreAgencia': '',
        'xMunicipioAgencia': '',
        'xCalleAgencia': '',
        'xNumAgencia': '',
        'xMedicoParticular': '',
        'xMunicipioParticular': '',
        'xCalleParticular': '',
        'xNumParticular': '',
        'xCuipParticular': '',
        'xPaternoParticular': '',
        'xMaternoParticular': '',
        'xNombreParticular': '',
        'xAdscripcionParticular': ''


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

public setDataIPH(_data) {

   let fechaConocimiento = moment(_data.fechaConocimiento).format('L');
   let fechaArribo = moment(_data.fechaArribo).format('L');
   let fechaPreservacion = moment(_data.fechaPreservacion).format('L');
   let fechaCertificado = moment (_data.fechaCertificado).format ('L');
   let fechaDetenido = moment (_data.fechaDetenido).format ('L');
   let fechaCanalizacion = moment (_data.fechaCanalizacion).format ('L');
   let lugarFechaEntrevistaFecha = moment (_data.lugarFechaEntrevistaFecha).format ('L');
   let datosEntrevistadoFechaNacimiento = moment (_data.datosEntrevistadoFechaNacimiento).format ('L');

    this.data['xNumeroReferencia']            = _data.numeroReferencia            
    this.data['xPrimerResponsable']           = _data.primerResponsable            
    this.data['xInstitucion']                 = _data.institucion         
    this.data['xMunicipio']                   = _data.municipio
    this.data['xCuip']                        = _data.cuip
    this.data['xEnteroHecho']                 = _data.enteroHecho
    this.data['xEspecifique']                 = _data.especifique
    this.data['xFechaConocimiento']           = fechaConocimiento     
    this.data['xHoraConocimiento']            = _data.horaConocimiento    
    this.data['xFechaArribo']                 = fechaArribo
    this.data['xHoraArribo']                  = _data.horaArribo
    this.data['xEntidadArribo']               = _data.entidadArribo 
    this.data['xMunicipioArribo']             = _data.municipioArribo   
    this.data['xLocalidadArribo']             = _data.localidadArribo   
    this.data['xCalleArribo']                 = _data.calleArribo
    this.data['xNumIntArribo']                = _data.numIntArribo
    this.data['xNumExtArribo']                = _data.numExtArribo
    this.data['xEntreCalleArribo']            = _data.entreCalleArribo    
    this.data['xTramoCarreteroArribo']        = _data.tramoCarreteroArribo       
    this.data['xTipoArribo']                  = _data.tipoArribo
    this.data['xKmArribo']                    = _data.kmArribo
    this.data['xLatitudArribo']               = _data.latitudArribo
    this.data['xLongitudArribo']              = _data.longitudArribo 
    this.data['xRiesgoPara']                  = _data.riesgoPara  
    this.data['xTipoRiesgo']                  = _data.tipoRiesgo
    this.data['xEspecifiqueRiesgo']           = _data.especifiqueRiesgo     
    this.data['xApoyo']                       = _data.apoyo
    this.data['xNumEconomico']                = _data.numEconomico
    this.data['xEspecifiqueApoyo']            = _data.especifiqueApoyo
    this.data['xNarracionHechosResponsable']  = _data.narracionHechosResponsable          
    this.data['xProteccion']                  = _data.proteccion
    this.data['xRecepcionAcciones']           = _data.recepcionAcciones
    this.data['xRecoleccionAcciones']         = _data.recoleccionAcciones  
    this.data['xProteccionAcciones']          = _data.proteccionAcciones 
    this.data['xResguardoAcciones']           = _data.resguardoAcciones
    this.data['xPreservacionAcciones']        = _data.preservacionAcciones   
    this.data['xInformarAcciones']            = _data.informarAcciones
    this.data['xProteccionAccionesA']         = _data.proteccionAccionesA  
    this.data['xResguardoAccionesA']          = _data.resguardoAccionesA 
    this.data['xDetencionAcciones']           = _data.detencionAcciones
    this.data['xFuerzaAcciones']              = _data.fuerzaAcciones
    this.data['xPuestoAcciones']              = _data.puestoAcciones
    this.data['xInventarioAcciones']          = _data.inventarioAcciones 
    this.data['xTrasladoAcciones']            = _data.trasladoAcciones
    this.data['xInspeccionesAcciones']        = _data.inspeccionesAcciones   
    this.data['xEchosFavorAcciones']          = _data.echosFavorAcciones 
    this.data['xTrasladoAccionesA']           = _data.trasladoAccionesA
    this.data['xTrasladoAccionesDe']          = _data.trasladoAccionesDe 
    this.data['xInspeccionesAccionesA']       = _data.InspeccionesAccionesA    
    this.data['xEntrevistasAcciones']         = _data.entrevistasAcciones  
    this.data['xFechaPreservacion']           = fechaPreservacion
    this.data['xHoraPreservacion']            = _data.horaPreservacion
    this.data['xAcordonamiento']              = _data.acordonamiento
    this.data['xCuipAcordonamiento']          = _data.cuipAcordonamiento 
    this.data['xPaternoAcordonamiento']       = _data.paternoAcordonamiento    
    this.data['xMaternoAcordonamiento']       = _data.maternoAcordonamiento    
    this.data['xNombreAcordonamiento']        = _data.nombreAcordonamiento   
    this.data['xAdcripcionAcordonamiento']    = _data.adcripcionAcordonamiento       
    this.data['xResguardo']                   = _data.resguardo
    this.data['xCuipResguardo']               = _data.cuipResguardo
    this.data['xPaternoResguardo']            = _data.paternoResguardo
    this.data['xMaternoResguardo']            = _data.maternoResguardo
    this.data['xNombreResguardo']             = _data.nombreResguardo
    this.data['xAdcripcionResguardo']         = _data.adcripcionResguardo  
    this.data['xFechaCertificado']            = fechaCertificado
    this.data['xHoraCertificado']             = _data.horaCertificado
    this.data['xMedico']                      = _data.medico
    this.data['xMedicoAgencia']               = _data.medicoAgencia
    this.data['xNombreAgencia']               = _data.nombreAgencia
    this.data['xMunicipioAgencia']            = _data.municipioAgencia
    this.data['xCalleAgencia']                = _data.calleAgencia
    this.data['xNumAgencia']                  = _data.numAgencia
    this.data['xMedicoParticular']            = _data.medicoParticular
    this.data['xMunicipioParticular']         = _data.municipioParticular  
    this.data['xCalleParticular']             = _data.calleParticular
    this.data['xNumParticular']               = _data.numParticular
    this.data['xCuipParticular']              = _data.cuipParticular
    this.data['xPaternoParticular']            = _data.paternoParticular
    this.data['xMaternoParticular']           = _data.maternoParticular 
    this.data['xNombreParticular']            = _data.nombreParticular
    this.data['xAdscripcionParticular']       = _data.adscripcionParticular
   

    //Anexo1
    this.data['xDetenido']                    = _data.detenido
    this.data['xPaternoDetenido']             = _data.paternoDetenido
    this.data['xMaternoDetenido']             = _data.maternoDetenido
    this.data['xNombreDetenido']              = _data.nombreDetenido

    //Anexo2
    this.data['xMotivoDetencion']             = _data.motivoDetencion
    this.data['xFechaDetencion']              = _data.fechaDetencion
    this.data['xHoraDetencion']               = _data.horaDetencion
    this.data['xEntidadDetencion']            = _data.entidadDetencion
    this.data['xMunicipioDetencion']          = _data.municipioDetencion
    this.data['xLocalidadDetencion']          = _data.localidadDetencion
    this.data['xCalleDetencion']              = _data.calleDetencion
    this.data['xNumIntDetencion']             = _data.numIntDetencion
    this.data['xNumExtDetencion']             = _data.numExtDetencion
    this.data['xEntreCalleDetencion']         = _data.entreCalleDetencion
    this.data['xCpDetencion']                 = _data.cpDetencion
    this.data['xLatitudDetencion']            = _data.latitudDetencion
    this.data['xLongitudDetencion']           = _data.longitudDetencion
    this.data['xPaternoDetecion']             = _data.paternoDetecion
    this.data['xMaternoDetecion']             = _data.maternoDetecion
    this.data['xMaternoDetecion']             = _data.maternoDetecion
    this.data['xNombreDetencion']             = _data.nombreDetencion
    this.data['xEdadRefeDetencion']           = _data.edadRefeDetencion
    this.data['xCalleDetenido']               = _data.calleDetenido
    this.data ['xNumExtDetenido']             = _data.numExtDetenido
    this.data ['xNumIntDetenido']             = _data.numIntDetenido
    this.data ['xCpDetenido']                 = _data.cpDetenido
    this.data ['xFechaDetenido']              = fechaDetenido
    this.data ['xCasadoDetenido']             = _data.casadoDetenido
    this.data ['xOcupacionDetenido']          = _data.ocupacionDetenido
    this.data ['xNacionalidadDetenido']       = _data.nacionalidadDetenido
    this.data ['xRfcCurpDetenido']            = _data.rfcCurpDetenido
    this.data ['xSeñalesParticularesDetenido']  = _data.señalesParticularesDetenido
    this.data ['xDescripcionFisicaDetenido']  = _data.descripcionFisicaDetenido
    this.data ['xTipoVestimentaDetenido']     = _data.tipoVestimentaDetenido
    //Anexo 3
    this.data ['xSituacionUsoFuerza']         = _data.situacionUsoFuerza
    this.data ['xPaternoFuerza']              = _data.paternoFuerza
    this.data ['xMaternoFuerza']              = _data.maternoFuerza
    this.data ['xNombreFuerza']               = _data.nombreFuerza     
    this.data ['xPaternoPrimerFuerza']        = _data.paternoPrimerFuerza
    this.data ['xMaternoPrimerFuerza']        = _data.maternoPrimerFuerza
    this.data ['xNombrePrimerFuerza']         = _data.nombrePrimerFuerza
    this.data ['xFechaCanalizacion']          = fechaCanalizacion  
    this.data ['xHoraCanalizacion']           = _data.horaCanalizacion

    //Anexo5
    this.data ['xDetenidoPertenencia']        = _data.detenidoPertenencia
    this.data ['xObjeto']                     = _data.objeto
    this.data ['xCantidadObjeto']             = _data.cantidadObjeto
    
    //Anexo 6
    this.data ['xPaternoPrimerVictima']        = _data.paternoPrimerVictima
    this.data ['xMaternoPrimerVictima']        = _data.maternoPrimerVictima
    this.data ['xNombrePrimerVictima']         = _data.nombrePrimerVictima
    this.data ['xPaternoRespondiente']         = _data.paternoRespondiente
    this.data ['xMaternoRespondiente']         = _data.maternoRespondiente
    this.data ['xNombreRespondiente']          = _data.nombreRespondiente

    //Anexo 7
    this.data ['xTrasladoA']                   = _data.trasladoA
    this.data ['xTipoTraslado']                = _data.tipoTraslado
    this.data ['xEspecifiqueTraslado']         = _data.especifiqueTraslado
    this.data ['xAgenciaTraslado']             = _data.agenciaTraslado
    this.data ['xEstadoAgenciaTraslado']       = _data.estadoAgenciaTraslado
    this.data ['xMunicipioAgenciaTraslado']    = _data.municipioAgenciaTraslado
    this.data ['xColoniaAgenciaTraslado']      = _data.coloniaAgenciaTraslado
    this.data ['xCalleAgenciaTraslado']        = _data.calleAgenciaTraslado
    this.data ['xNumExtAgenciaTraslado']       = _data.numExtAgenciaTraslado
    this.data ['xCpAgenciaTraslado']           = _data.cpAgenciaTraslado
    this.data ['xPaternoEntregaTraslado']      = _data.paternoEntregaTraslado
    this.data ['xMaternoEntregaTraslado']      = _data.maternoEntregaTraslado
    this.data ['xNombreEntregaTraslado']       = _data.nombreEntregaTraslado
    this.data ['xCargaEntregaTraslado']        = _data.cargaEntregaTraslado
    this.data ['xPaternoRecibeTraslado']       = _data.paternoRecibeTraslado
    this.data ['xMaternoRecibeTraslado']       = _data.maternoRecibeTraslado
    this.data ['xNombreRecibeTraslado']        = _data.nombreRecibeTraslado
    this.data ['xFechaTraslado']               = _data.fechaTraslado
    this.data ['xHoraTraslado']                = _data.horaTraslado

    //Anexo 8
    this.data ['xTipoLugarIntervencion']       = _data.tipoLugarIntervencion
    this.data ['xOtroLugarIntervencion']       = _data.otroLugarIntervencion
    this.data ['xCaracterLugarIntervencion']   = _data.caracterLugarIntervencion
    this.data ['xSueloIntervencion']           = _data.sueloIntervencion
    this.data ['xCondicionesIntervencion']     = _data.condicionesIntervencion
    this.data ['xIluminacionIntervencion']     = _data.iluminacionIntervencion
    this.data ['xTipoObjetosEncontradosArmaTipo']      = _data.tipoObjetosEncontradosArmaTipo
    this.data ['xTipoObjetosEncontradosArmaCantidad']  = _data.tipoObjetosEncontradosArmaCantidad
    this.data ['xTipoObjetosEncontradosDineroMoneda']  = _data.tipoObjetosEncontradosDineroMoneda
    this.data ['xTipoObjetosEncontradosDineroOtra']   = _data.tipoObjetosEncontradosDineroOtra
    this.data ['xTipoObjetosEncontradosDineroCantidad']    = _data.tipoObjetosEncontradosDineroCantidad
    this.data ['xTipoObjetosEncontradosCadaverCantidad'] = _data.tipoObjetosEncontradosCadaverCantidad
    this.data ['xTipoObjetosEncontradosRestosHumanosCantidad'] =_data.tipoObjetosEncontradosRestosHumanosCantidad
    this.data ['xTipoObjetosEncontradosPersonasCantidad'] = _data.tipoObjetosEncontradosPersonasCantidad
    this.data ['xTipoObjetosEncontradosDocumentosCantidad'] = _data.tipoObjetosEncontradosDocumentosCantidad
    this.data ['xTipoObjetosEncontradosOtroObjetoCantidad'] = _data.tipoObjetosEncontradosOtroObjetoCantidad
    this.data ['xTipoObjetosEncontradosCaracteristicasNarcoticosTipo'] = _data.tipoObjetosEncontradosCaracteristicasNarcoticosTipo
    this.data ['xTipoObjetosEncontradosCaracteristicasNarcoticosCantidad'] =_data.tipoObjetosEncontradosCaracteristicasNarcoticosCantidad
    this.data ['xInspeccionesPersonasPaterno'] = _data.inspeccionesPersonasPaterno
    this.data ['xInspeccionesPersonasMaterno'] = _data.inspeccionesPersonasMaterno
    this.data ['xInspeccionesPersonasNombres'] = _data.inspeccionesPersonasNombres
    this.data ['xObjetosEncontradosArmasTipo'] = _data.objetosEncontradosArmasTipo
    this.data ['xObjetosEncontradosArmasCantidad'] = _data.objetosEncontradosArmasCantidad
    this.data ['xObjetosEncontradosDineroMoneda']  = _data.objetosEncontradosDineroMoneda
    this.data ['xObjetosEncontradosDineroOtra']    = _data.objetosEncontradosDineroOtra
    this.data ['xObjetosEncontradosDineroCantidad'] = _data.objetosEncontradosDineroCantidad
    this.data ['xObjetosEncontradosCaracteristicasNarcoticosTipo'] = _data.objetosEncontradosCaracteristicasNarcoticosTipo
    this.data ['xObjetosEncontradosCaracteristicasNarcoticosCantidad'] = _data.objetosEncontradosCaracteristicasNarcoticosCantidad
    this.data ['xObjetosEncontradosDocumentosCantidad']    = _data.objetosEncontradosDocumentosCantidad
    this.data ['xObjetosEncontradosOtroObjetoCantidad']    = _data.objetosEncontradosOtroObjetoCantidad

    //Anexo 8 Json enlazados pero no agregados en el documento
    this.data ['xObjetosEncontradosMedioTransporteTipo']   = _data.objetosEncontradosMedioTransporteTipo
    this.data ['xObjetosEncontradosMedioTransporteMarca']  = _data.objetosEncontradosMedioTransporteMarca
    this.data ['xObjetosEncontradosMedioTransporteSubmarca'] = _data.objetosEncontradosMedioTransporteSubmarca
    this.data ['xObjetosEncontradosMedioTransporteModelo'] = _data.objetosEncontradosMedioTransporteModelo
    this.data ['xObjetosEncontradosMedioTransportePlaca']  = _data.objetosEncontradosMedioTransportePlaca
    this.data ['xObjetosEncontradosMedioTransporteNumeroPermiso'] = _data.objetosEncontradosMedioTransporteNumeroPermiso
    this.data ['xObjetosEncontradosMedioTransporteNumeroSerie'] = _data.objetosEncontradosMedioTransporteNumeroSerie
    this.data ['xObjetosEncontradosMedioTransporteNumeroMoto']  = _data.objetosEncontradosMedioTransporteNumeroMoto
    this.data ['xObjetosEncontradosMedioTransporteNumeroColor'] = _data.objetosEncontradosMedioTransporteNumeroColor
    this.data ['xObjetosEncontradosMedioTransporteProcedencia'] = _data.objetosEncontradosMedioTransporteProcedencia
    this.data ['xInspeccionesMedioTransportePaterno'] = _data.inspeccionesMedioTransportePaterno
    this.data ['xInspeccionesMedioTransporteMaterno'] = _data.inspeccionesMedioTransporteMaterno
    this.data ['xInspeccionesMedioTransporteNombres'] = _data.inspeccionesMedioTransporteNombres
    this.data ['xArmasCantidadObjetosEncontrados']    = _data.armasCantidadObjetosEncontrados
    this.data ['xCargadoresCantidadObjetosEncontrado'] = _data.cargadoresCantidadObjetosEncontrado
    this.data ['xCartuchosCantidadObjetosEncontrados'] = _data.cartuchosCantidadObjetosEncontrados
    this.data ['xCasquillosCantidadObjetosEncontrados'] = _data.casquillosCantidadObjetosEncontrados
    this.data ['xDineroMonedaObjetosEncontrados'] = _data.dineroMonedaObjetosEncontrados
    this.data ['xDineroOtraObjetosEncontrados'] = _data.dineroOtraObjetosEncontrados
    this.data ['xDineroCantidadObjetosEncontrados'] = _data.dineroCantidadObjetosEncontrados
    this.data ['xCaracteristicasNarcoticosTipoObjetosEncontrados'] = _data.caracteristicasNarcoticosTipoObjetosEncontrados
    this.data ['xCaracteristicasNarcoticosCantidadObjetosEncontrados'] = _data.caracteristicasNarcoticosCantidadObjetosEncontrados
    this.data ['xDocumentosCantidadTipoObjetosEncontrados'] = _data.documentosCantidadTipoObjetosEncontrados
    this.data ['xPersonasCantidadTipoObjetosEncontrados'] = _data.personasCantidadTipoObjetosEncontrados
    this.data ['xCadaverCantidadTipoObjetosEncontrados']  = _data.cadaverCantidadTipoObjetosEncontrados
    this.data ['xRestosHumanosCantidadTipoObjetosEncontrados'] = _data.restosHumanosCantidadTipoObjetosEncontrados
    this.data ['xOtroObjetoCantidadTipoObjetosEncontrados'] = _data.otroObjetoCantidadTipoObjetosEncontrados

    //Anexo 9 
    this.data ['xInventarioTipoObjeto'] = _data.inventarioTipoObjeto
    this.data ['xInventarioCantidad']   = _data.inventarioCantidad
    this.data ['xInventarioEspecificacion'] = _data.inventarioEspecificacion


    //Anexo 10
    this.data ['xEntregaLugar']         = _data.entregaLugar
    this.data ['xEntregaEntidad']       = _data.entregaEntidad
    this.data ['xEntregaMunicipio']     = _data.entregaMunicipio
    this.data ['xEntregaColonia']       = _data.entregaColonia
    this.data ['xEntregaCalle']         = _data.entregaCalle
    this.data ['xEntregaNumInterior']   = _data.entregaNumInterior
    this.data ['xEntregaNumExterior']   = _data.entregaNumExterior
    this.data ['xEntregaCp']            = _data.entregaCp

    //Anexo 11
    this.data ['xEntrevistaVictimaPersona']     = _data.entrevistaVictimaPersona
    this.data ['xLugarFechaEntrevistaFecha']    = lugarFechaEntrevistaFecha
    this.data ['xLugarFechaEntrevistaHora']     = _data.lugarFechaEntrevistaHora
    this.data ['xLugarFechaEntrevistaColonia']  = _data.lugarFechaEntrevistaColonia
    this.data ['xLugarFechaEntrevistaCalle']    = _data.lugarFechaEntrevistaCalle
    this.data ['xLugarFechaEntrevistaNumExterior']   = _data.lugarFechaEntrevistaNumExterior
    this.data ['xDatosEntrevistadoPaterno']     = _data.datosEntrevistadoPaterno
    this.data ['xDatosEntrevistadoMaterno']     = _data.datosEntrevistadoMaterno
    this.data ['xDatosEntrevistadoNombres']     = _data.datosEntrevistadoNombres
    this.data ['xDatosEntrevistadoSexo']        = _data.datosEntrevistadoSexo
    this.data ['xDatosEntrevistadoEstado']      = _data.datosEntrevistadoEstado
    this.data ['xDatosEntrevistadoMunicipio']   = _data.datosEntrevistadoMunicipio
    this.data ['xDatosEntrevistadoColonia']     = _data.datosEntrevistadoColonia
    this.data ['xDatosEntrevistadoCalle']       = _data.datosEntrevistadoCalle
    this.data ['xDatosEntrevistadoNumExterior'] = _data.datosEntrevistadoNumExterior
    this.data ['xDatosEntrevistadoNumInterior'] = _data.datosEntrevistadoNumInterior
    this.data ['xDatosEntrevistadoCp']          = _data.datosEntrevistadoCp
    this.data ['xDatosEntrevistadoFechaNacimiento']  = datosEntrevistadoFechaNacimiento
    this.data ['xDatosEntrevistadoCurp']        = _data.datosEntrevistadoCurp
    this.data ['xDatosEntrevistadoOcupacion']   = _data.datosEntrevistadoOcupacion
    this.data ['xDatosEntrevistadoRelato']      = _data.datosEntrevistadoRelato 
    this.data ['xDatosEntrevistadoEstadoCivil'] = _data.datosEntrevistadoEstadoCivil
    this.data ['xDatosEntrevistadorApellidoPaterno'] = _data.datosEntrevistadorApellidoPaterno
    this.data ['xDatosEntrevistadorApellidoMaterno'] = _data.datosEntrevistadorApellidoMaterno
    this.data ['xDatosEntrevistadorNombres']         = _data.datosEntrevistadorNombres
    this.data ['xDatosEntrevistadorAdscripcion'] = _data.datosEntrevistadorAdscripcion



    console.log('<<< data parseo >>>', this.data);
    return this.data;

}


}
