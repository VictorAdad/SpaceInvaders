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
import { _config } from '@app/app.config';
import { AuthenticationService } from '../auth/authentication.service';

@Injectable()
export class FormatosService {

    public formatos: FormatosLocal;

    constructor(
        private http: HttpService,
        private auth: AuthenticationService) {
        this.formatos = new FormatosLocal(auth);
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

        const out = doc.getZip().generate({
            type: 'blob',
            mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        });

        return out;
    }

}

export class FormatosLocal {

    constructor(
        private auth: AuthenticationService
    ){}

    public F1_003 = {
        'path': environment.app.host+'/assets/formatos/F1-003 LECTURA DE DERECHOS DE LA VÍCTIMA.docx',
        'nombre': 'F1-003 LECTURA DE DERECHOS DE LA VÍCTIMA.docx',
        'nameEcm': 'LECTURA DE DERECHOS DE LA VÍCTIMA',
        'file': null,
        'data': null
    };
    public F1_004= {
        'path': environment.app.host+'/assets/formatos/F1-004 REGISTRO PRESENCIAL.docx',
        'nombre': 'F1-004 REGISTRO PRESENCIAL.docx',
        'nameEcm': 'REGISTRO PRESENCIAL',
        'file': null,
        'data': null
    };
    public F1_005 = {
        'path': environment.app.host+'/assets/formatos/F1-005 REGISTRO DE RECEPCIÓN DE LLAMADA.docx',
        'nombre': 'F1-005 REGISTRO DE RECEPCIÓN DE LLAMADA.docx',
        'nameEcm': 'REGISTRO DE RECEPCIÓN DE LLAMADA',
        'file': null,
        'data': null
    };
  // Formato de entrevista
  public F1_008 = {
    'path': environment.app.host+'/assets/formatos/F1-008 ENTREVISTA.docx',
    'nombre': 'F1-008 ENTREVISTA.docx',
    'nameEcm': 'ENTREVISTA',
    'file': null,
    'data': null
   };
    // Formato de solicitud pericial
   public F1_009 = {
    'path': environment.app.host+'/assets/formatos/F1-009 OFICIO SOLICITUD A SERVICIOS PERICIALES.docx',
    'nombre': 'F1-009 OFICIO SOLICITUD A SERVICIOS PERICIALES.docx',
    'nameEcm': 'OFICIO SOLICITUD A SERVICIOS PERICIALES',
    'file': null,
    'data': null
   };
   public F1_010 = {
    'path': environment.app.host+'/assets/formatos/F1-010 SOLICITUD EXAMEN PSICOFÍSICO.docx',
    'nombre': 'F1-010 SOLICITUD EXAMEN PSICOFÍSICO.docx',
    'nameEcm': 'SOLICITUD EXAMEN PSICOFÍSICO',
    'file': null,
    'data': null
   };
    // Formato de solicitud policia ministerial
   public F1_011 = {
    'path': environment.app.host+'/assets/formatos/F1-011 OFICIO SOLICITUD A POLICIA MINISTERIAL.docx',
    'nombre': 'F1-011 OFICIO SOLICITUD A POLICIA MINISTERIAL.docx',
    'nameEcm': 'OFICIO SOLICITUD A POLICIA MINISTERIAL',
    'file': null,
    'data': null
   };
   public F1_021 = {
    'path': environment.app.host+'/assets/formatos/F1-021 OFICIO SOLICITUD A POLICIA MINISTERIAL SIN APERCIBIMIENTO.docx',
    'nombre': 'F1-021 OFICIO SOLICITUD A POLICIA MINISTERIAL SIN APERCIBIMIENTO.docx',
    'nameEcm': 'OFICIO SOLICITUD A POLICIA MINISTERIAL SIN APERCIBIMIENTO',
    'file': null,
    'data': null
   };

   public getVicImp(_data, _id_solicitud, _interVi) {
       var victimasHeredar = [];
       var nombreVicHer = '';

       var tipo1
       var tipo2
       var label = '';
       if (_interVi) {
           tipo1 = 'imputado'
           tipo2 = 'imputadoDesconocido'
           label = 'Quién resulte responsable'
       } else {
           tipo1 = 'victima'
           tipo2 = 'victimaDesconocido'
           label = 'Identidad desconocida'
       }

       for (let i=0;i < _data.solicitudPrePericiales.length; i++) {
          const solicitud = _data.solicitudPrePericiales[i];
          if (solicitud.id == _id_solicitud) {
              if (solicitud.heredar) {
                  for (var j = 0; j < solicitud.personas.length; j++) {
                      const persona = solicitud.personas[j];
                      console.log(persona);
                        victimasHeredar.push(persona.id);
                  }
              }
          }
      }

     for (let i = 0; i < _data.personaCasos.length; i++) {
         if (_data.personaCasos[i].tipoInterviniente.id == _config.optionValue.tipoInterviniente[tipo1] || _data.personaCasos[i].tipoInterviniente.id == _config.optionValue.tipoInterviniente[tipo2]) { //hola
             for (var j = 0; j < victimasHeredar.length; j++) {
                 if (victimasHeredar[j] == _data.personaCasos[i].id) {
                     if (_data.personaCasos[i].tipoInterviniente.id == _config.optionValue.tipoInterviniente[tipo2]) {
                         if (nombreVicHer == '')
                             nombreVicHer = label;
                         else
                            nombreVicHer += ', '+ label; 

                     } else {
                         if (nombreVicHer == '')
                             nombreVicHer = _data.personaCasos[i].persona.nombre+' '+_data.personaCasos[i].persona.paterno+' '+(_data.personaCasos[i].persona.materno ? _data.personaCasos[i].persona.materno : '');
                         else
                            nombreVicHer += ', '+ _data.personaCasos[i].persona.nombre+' '+_data.personaCasos[i].persona.paterno+' '+(_data.personaCasos[i].persona.materno ? _data.personaCasos[i].persona.materno : ''); 
                     }
                 }   
             }
         }
     }

     return nombreVicHer;
   }



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

    public setDataF1003(_caso) {
        // Logger.log('Formatos@setDataF1003', _caso);
        const nombrePersonas = [];
        const identificaciones = [];
        const foliosIdentificacion = [];
        const predenuncia =  _caso.predenuncias;
        const personas = this.findHerenciaPersonasPredenuncia(_caso);

        personas.forEach(o => {
            nombrePersonas.push(` ${o.persona.nombre} ${o.persona.paterno} ${o.persona.materno}`);
            if (o.persona.idiomaIdentificacion.identificacion) {
                identificaciones.push(o.persona.idiomaIdentificacion.identificacion);
            }
            if (o.persona.folioIdentificacion) {
                foliosIdentificacion.push(o.persona.folioIdentificacion);
            }
        });


        this.setCasoInfo(_caso);
        this.data['xVictima'] = nombrePersonas.toLocaleString();
        this.data['xVictimaFirma'] = nombrePersonas.toLocaleString().toLocaleUpperCase();
        this.data['xSeIdentificaConFirma'] = identificaciones ? identificaciones.toLocaleString() : '';
        this.data['xFolioVictimaFirma'] = foliosIdentificacion ? foliosIdentificacion.toLocaleString() : '';
        this.data['xFolioDocumento'] = !predenuncia ? '' :(predenuncia.noFolioConstancia ? predenuncia.noFolioConstancia  : '');
        this.data['xHablaEspaniol'] = !predenuncia ? '' :(predenuncia.hablaEspaniol ? 'Sí' : 'No');
        this.data['xIdiomaLengua'] = !predenuncia ? '' :(predenuncia.hablaEspaniol ? '' : predenuncia.lenguaIdioma);
        this.data['xInterprete'] = !predenuncia ? '' :(predenuncia.nombreInterprete ? predenuncia.nombreInterprete  : '');
        this.data['xComprendioDerechos'] = !predenuncia ? '' :(predenuncia.compredioDerechos ? 'Sí' : 'No');
        this.data['xCopiaDerechos'] = !predenuncia ? '' :(predenuncia.proporcionoCopia ? 'Sí' : 'No');

        this.data['xCargoEmisorFirma']        = this.auth.user.cargo.toLocaleUpperCase();
        this.data['xNombreEmisorFirma']       = this.auth.user.nombreCompleto.toLocaleUpperCase();
        this.data['xAdscripcionEmisorFirma']  = this.auth.user.agenciaCompleto.toLocaleUpperCase();
    }

    public setDataF1004(_caso) {
        // Logger.log('Formatos@setDataF1004', _data);
        const personas = this.findHerenciaPersonasPredenuncia(_caso);
        const nombres = [];
        const calidadPersonas = [];
        const tiposPersonas = [];
        const noParticulares = [];
        const originarios = [];
        const edades = [];
        const sexos = [];
        const domicilios = [];
        const noMoviles = [];
        const fechasNacimientos = [];
        const rfcs = [];
        const curps = [];
        const estadosCiviles = [];
        const ocupaciones = [];
        const escolaridades = [];
        const religiones = [];
        const nacionalidades = [];
        const identificaciones = [];
        const folios = [];

        personas.forEach(o => {
            nombres.push(` ${o.persona.nombre} ${o.persona.paterno} ${o.persona.materno}`);
            if (o.tipoInterviniente) {
                calidadPersonas.push(` ${o.tipoInterviniente.tipo}`);
            }
            if (o.persona.tipoPersona) {
                tiposPersonas.push(` ${o.persona.tipoPersona}`);
            }
            if (o.persona.fechaNacimiento) {
                fechasNacimientos.push(` ${o.persona.fechaNacimiento}`);
            }
            if (o.persona.rfc) {
                rfcs.push(` ${o.persona.rfc}`);
            }
            if (o.persona.estado) {
                curps.push(` ${o.persona.curp}`);
            }
            if (o.persona.edad) {
                edades.push(` ${o.persona.edad}`);
            }
            if (o.persona.folioIdentificacion) {
                folios.push(` ${o.folioIdentificacion}`);
            }
            if (o.persona.estado) {
                originarios.push(` ${o.persona.estado.nombre}`);
            }
            if (o.persona.localizacionPersona.length > 0) {
                domicilios.push(` ${o.estado.nombre}`);
                noParticulares.push(` ${o.estado.nombre}`);
                noMoviles.push(` ${o.estado.nombre}`);
            }
            if (o.sexo) {
                sexos.push(` ${o.persona.sexo.nombre}`);
            }
            if (o.persona.estadoCivil) {
                estadosCiviles.push(` ${o.persona.estadoCivil.nombre}`);
            }
            if (o.persona.ocupacion) {
                ocupaciones.push(` ${o.persona.ocupacion.nombre}`);
            }
            if (o.persona.escolaridad) {
                escolaridades.push(` ${o.persona.escolaridad.nombre}`);
            }
            if (o.persona.nacionalidadReligion) {
                religiones.push(` ${o.persona.nacionalidadReligion.religion}`);
                nacionalidades.push(` ${o.persona.nacionalidadReligion.religion}`);
            }
            if (o.persona.idiomaIdentificacion) {
                if (o.persona.idiomaIdentificacion.identificacion) {
                    identificaciones.push(` ${o.persona.idiomaIdentificacion.identificacion}`);
                }
            }
        });
        this.setCasoInfo(_caso);
        this.data['xNombreUsuario'] = nombres.toLocaleString();
        this.data['xOriginario'] = originarios.toLocaleString();
        this.data['xEdad'] = edades.toLocaleString();
        this.data['xSexo'] = sexos.toLocaleString();
        this.data['xDomicilio'] = domicilios.toLocaleString();
        this.data['xCalidadUsuarioPersona'] = calidadPersonas.toLocaleString();
        this.data['xTipoPersona'] = tiposPersonas.toLocaleString();
        this.data['xFechaNacimiento'] = fechasNacimientos.toLocaleString();
        this.data['xRFC'] = rfcs.toLocaleString();
        this.data['xCURP'] = curps.toLocaleString();
        this.data['xEstadoCivil'] = estadosCiviles.toLocaleString();
        this.data['xOcupacion'] = ocupaciones.toLocaleString();
        this.data['xEscolaridad'] = escolaridades.toLocaleString();
        this.data['xReligion'] = religiones.toLocaleString();
        this.data['xNacionalidad'] = nacionalidades.toLocaleString();
        this.data['xNumeroTelefonico'] = noParticulares.toLocaleString();
        this.data['xNumeroMovil'] = noMoviles.toLocaleString();
        this.data['xSeIdentificaCon'] = identificaciones.toLocaleString();
        this.data['xFolioIdentificacion'] = folios.toLocaleString();

        if (_caso.predenuncias ) {
            this.data['xFolioIdentificacion'] = (_caso.predenuncias.noFolioConstancia ? _caso.predenuncias.noFolioConstancia : '');
            this.data['xHechosNarrados'] = (_caso.predenuncias.hechosNarrados ? _caso.predenuncias.hechosNarrados : '');
            this.data['xConclusionHechos'] = (_caso.predenuncias.conclusion ? _caso.predenuncias.conclusion : '');
            this.data['xLugarHechos'] = (_caso.predenuncias.lugarHechos ? _caso.predenuncias.lugarHechos : '');
            this.data['xCanalizacion'] = (_caso.predenuncias.canalizacion ? _caso.predenuncias.canalizacion : '');
            this.data['xInstitucionCanalizacion'] = (_caso.predenuncias.institucion ? _caso.predenuncias.institucion : '');
            this.data['xMotivoCanalizacion'] = (_caso.predenuncias.motivoCanalizacion ? _caso.predenuncias.motivoCanalizacion : '');
            this.data['xFechaCanalizacion'] = (_caso.predenuncias.fechaCanalizacion ? _caso.predenuncias.fechaCanalizacion : '');
            this.data['xHoraCanalizacion'] = (_caso.predenuncias.horaCanalizacion ? _caso.predenuncias.horaCanalizacion : '');
            this.data['xNombreCausoHecho'] = (_caso.predenuncias.nombreCausante ? _caso.predenuncias.nombreCausante : '');
            this.data['xDomicilioHechos'] = (_caso.predenuncias.domicilioCausante ? _caso.predenuncias.domicilioCausante : '');
            this.data['xObservaciones'] = (_caso.predenuncias.observaciones ? _caso.predenuncias.observaciones : '');
        }
    }

    public setDataF1005(_data){
        this.setCasoInfo(_data);
        // this.setVictimaInfo(_data);
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
        let nombreVictima = '';
        if (victima.tipoInterviniente.id === _config.optionValue.tipoInterviniente.victimaDesconocido) {
            nombreVictima = 'Identidad desconocida';
        }else {
            nombreVictima =
                `${victima.persona.nombre} ${victima.persona.paterno} ${victima.persona.materno ? victima.persona.materno :'' }`;
        }
        this.data['xVictima']         = nombreVictima;
        this.data['xFolioVictima']    = victima.persona.folioIdentificacion ? victima.persona.folioIdentificacion : '';
        this.data['xSeIdentificaCon'] = _caso.getAlias(victima);
        this.data['xDomicilio']       = _caso.getDomicilios(victima);
        this.data['xOriginario']      = victima.persona.pais ? victima.persona.pais.nombre : '';
        this.data['xEdad']            = victima.persona.edad;
        this.data['xSexo']            = victima.persona.sexo ? victima.persona.sexo.nombre : '';
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
  let nombresVictimas = '';
  let nombresImputados = '';

  if (_data.heredar) {
      nombresVictimas = this.getVicImp(_data, _id_solicitud, false);
      nombresImputados = this.getVicImp(_data, _id_solicitud, true);
   } else {
       for (let i = 0; i < _data.personaCasos.length; i++) {
           if (_data.personaCasos[i].tipoInterviniente.id == _config.optionValue.tipoInterviniente.victima || _data.personaCasos[i].tipoInterviniente.id == _config.optionValue.tipoInterviniente.victimaDesconocido) {
               if (_data.personaCasos[i].tipoInterviniente.id == _config.optionValue.tipoInterviniente.victimaDesconocido) {
                   if (nombresVictimas == '') {
                       nombresVictimas = 'Identidad desconocida';
                   } else {
                       nombresVictimas += ', '+ 'Identidad desconocida';
                   }   
               } else {
                   if (nombresVictimas == '') {
                       nombresVictimas = _data.personaCasos[i].persona.nombre+' '+_data.personaCasos[i].persona.paterno+' '+(_data.personaCasos[i].persona.materno ? _data.personaCasos[i].persona.materno : '');
                   } else {
                       nombresVictimas += ', '+ _data.personaCasos[i].persona.nombre+' '+_data.personaCasos[i].persona.paterno+' '+(_data.personaCasos[i].persona.materno ? _data.personaCasos[i].persona.materno : '');
                   }                   
               }
           }
       }

       for (let i = 0; i < _data.personaCasos.length; i++) {
           if (_data.personaCasos[i].tipoInterviniente.id == _config.optionValue.tipoInterviniente.imputado || _data.personaCasos[i].tipoInterviniente.id == _config.optionValue.tipoInterviniente.imputadoDesconocido) {
               if (_data.personaCasos[i].tipoInterviniente.id == _config.optionValue.tipoInterviniente.imputadoDesconocido) {
                   if (nombresImputados == '') {
                       nombresImputados = 'Quién resulte responsable';
                   } else {
                       nombresImputados += ', '+ 'Quién resulte responsable';
                   }     
               } else {
                   if (nombresImputados == '') {
                       nombresImputados = _data.personaCasos[i].persona.nombre+' '+_data.personaCasos[i].persona.paterno+' '+(_data.personaCasos[i].persona.materno ? _data.personaCasos[i].persona.materno : '');
                   } else {
                       nombresImputados += ', '+ _data.personaCasos[i].persona.nombre+' '+_data.personaCasos[i].persona.paterno+' '+(_data.personaCasos[i].persona.materno ? _data.personaCasos[i].persona.materno : '');
                   }                   
               }
           }
       }
   }

  var pericial;

  _data.solicitudPrePericiales.forEach(solicitud => {
     if(solicitud.id===_id_solicitud){
         pericial=solicitud;
     }
  });

  var date = new Date();
  if(pericial != null)
      date= new Date(pericial.created);

  if (date) {
      var dia = date.getDate();
      var mes = 1 + date.getMonth();
      var anio = date.getFullYear();
  }

  this.data['xNUC']                     = _data.nuc? _data.nuc:'';
  this.data['xNIC']                     = _data.nic? _data.nic:'';
  this.data['xHechoDelictivo']          = _data.delitoPrincipal.nombre ? _data.delitoPrincipal.nombre : '';
  this.data['xVictima']                 = nombresVictimas;
  this.data['xImputado']                = nombresImputados;
  this.data['xOficio']                  = pericial.noOficio ? pericial.noOficio : '';
  this.data['xEstado']                  = 'Estado de México';
  this.data['xPoblacion']               = this.auth.user.municipio;
  this.data['xDia']                     = dia ? dia.toString() : '';
  this.data['xMes']                     = mes ? mes.toString() : '';
  this.data['xAnio']                    = anio ? anio.toString(): '';
  this.data['xSolicitaPerito']          = pericial.peritoMateria ? pericial.peritoMateria.nombre : '';
  this.data['xFinalidadRequerimiento']  = pericial.finalidad?pericial.finalidad:'';
  this.data['xPlazoRendirInformes']     = pericial.plazoDias? pericial.plazoDias: '';
  this.data['xApercibimiento']          = pericial.apercibimiento ? pericial.apercibimiento: '';
  this.data['xDirectorInstituto']       = pericial.directorInstituto ? pericial.directorInstituto: '';
  this.data['xNombreEmisorFirma']       = this.auth.user.nombreCompleto;
  this.data['xAdscripcionEmisorFirma']  = this.auth.user.agenciaCompleto;
  this.data['xCargoEmisorFirma']        = this.auth.user.cargo;



}

public setDataF1010(_data,_id_solicitud){
  Logger.log('Formatos@setDataF1010', _data);

  let nombresVictimas = '';
  let nombresImputados = '';

  if (_data.heredar) {
      nombresVictimas = this.getVicImp(_data, _id_solicitud, false);
      nombresImputados = this.getVicImp(_data, _id_solicitud, true);
   } else {
       for (let i = 0; i < _data.personaCasos.length; i++) {
           if (_data.personaCasos[i].tipoInterviniente.id == _config.optionValue.tipoInterviniente.victima || _data.personaCasos[i].tipoInterviniente.id == _config.optionValue.tipoInterviniente.victimaDesconocido) {
               if (_data.personaCasos[i].tipoInterviniente.id == _config.optionValue.tipoInterviniente.victimaDesconocido) {
                   if (nombresVictimas == '') {
                       nombresVictimas = 'Identidad desconocida';
                   } else {
                       nombresVictimas += ', '+ 'Identidad desconocida';
                   }   
               } else {
                   if (nombresVictimas == '') {
                       nombresVictimas = _data.personaCasos[i].persona.nombre+' '+_data.personaCasos[i].persona.paterno+' '+(_data.personaCasos[i].persona.materno ? _data.personaCasos[i].persona.materno : '');
                   } else {
                       nombresVictimas += ', '+ _data.personaCasos[i].persona.nombre+' '+_data.personaCasos[i].persona.paterno+' '+(_data.personaCasos[i].persona.materno ? _data.personaCasos[i].persona.materno : '');
                   }                   
               }
           }
       }

       for (let i = 0; i < _data.personaCasos.length; i++) {
           if (_data.personaCasos[i].tipoInterviniente.id == _config.optionValue.tipoInterviniente.imputado || _data.personaCasos[i].tipoInterviniente.id == _config.optionValue.tipoInterviniente.imputadoDesconocido) {
               if (_data.personaCasos[i].tipoInterviniente.id == _config.optionValue.tipoInterviniente.imputadoDesconocido) {
                   if (nombresImputados == '') {
                       nombresImputados = 'Quién resulte responsable';
                   } else {
                       nombresImputados += ', '+ 'Quién resulte responsable';
                   }     
               } else {
                   if (nombresImputados == '') {
                       nombresImputados = _data.personaCasos[i].persona.nombre+' '+_data.personaCasos[i].persona.paterno+' '+(_data.personaCasos[i].persona.materno ? _data.personaCasos[i].persona.materno : '');
                   } else {
                       nombresImputados += ', '+ _data.personaCasos[i].persona.nombre+' '+_data.personaCasos[i].persona.paterno+' '+(_data.personaCasos[i].persona.materno ? _data.personaCasos[i].persona.materno : '');
                   }                   
               }
           }
       }
   }

  let lugar:any={};//por definir
  let examen;

  _data.solicitudPrePericiales.forEach(solicitud => {
     if(solicitud.id===_id_solicitud){
         examen=solicitud;
     }
  });
  console.log('<<< examen >>>', examen);

  let date= new Date(examen.created);

  if (date) {
      var dia = date.getDate();
      var mes = 1 + date.getMonth();
      var anio = date.getFullYear();
  }

  this.data['xNUC']                = _data.nuc? _data.nuc:'';
  this.data['xNIC']                = _data.nic? _data.nic:'';
  this.data['xHechoDelictivo']     = _data.delitoPrincipal.nombre ? _data.delitoPrincipal.nombre : '';
  this.data['xVictima']            = nombresVictimas.toUpperCase();
  this.data['xImputado']           = nombresImputados.toUpperCase();
  this.data['xOficio']             = examen.noOficio ? examen.noOficio : ''; 
  this.data['xEstado']             = 'Estado de México';
  this.data['xPoblacion']          = this.auth.user.municipio;

  this.data['xDia']                = dia.toString();
  this.data['xMes']                = mes.toString();
  this.data['xAnio']               = anio.toString();
  this.data['xApercibimiento']     = examen.apercibimiento ? examen.apercibimiento: '';
  this.data['xMedicoLegistaMayus'] = examen.medicoLegista?examen.medicoLegista:'';
  this.data['xSolicitaExamen']     = examen.tipo? examen.tipo: '';
  this.data['xRealizaraExamen']    = examen.realizadoA ? examen.realizadoA: '';
  this.data['xNombreEmisorFirma']  = this.auth.user.nombreCompleto;
  this.data['xCargoEmisorFirma']   = this.auth.user.cargo;
  this.data['xAdscripcionEmisorFirma']  = this.auth.user.agenciaCompleto;

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

    public findHerenciaPersonasPredenuncia(_caso) {
        const personasIds  = _caso.predenuncias.personas;
        const personas = [];

        for (const personaId of personasIds) {
            personas.push(_caso.findPersonaCaso(personaId.personaCaso.id));
        }

        return personas;
    }


}
