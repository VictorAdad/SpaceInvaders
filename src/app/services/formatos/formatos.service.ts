import { TipoInterviniente } from './../../models/catalogo/tipoInterviniente';
import { PersonaFisicaImputadoComponent } from './../../components/app/noticiaHecho/persona/create/persona-fisica-imputado.component';
import { Injectable } from '@angular/core';
import { HttpService} from '@services/http.service';
import * as JSZip from 'jszip';
import * as JSZipUtils from 'jszip-utils';
import * as docxtemplater from 'docxtemplater';
import * as moment from 'moment';
import { forEach } from '@angular/router/src/utils/collection';
import { environment } from '../../../environments/environment';
import { Logger } from "@services/logger.service";
import { _config } from '@app/app.config';
import { AuthenticationService } from '../auth/authentication.service';
import { CIndexedDB } from '../indexedDB';

@Injectable()
export class FormatosService {

    public formatos: FormatosLocal;

    constructor(
        private http: HttpService,
        private auth: AuthenticationService,
        public db: CIndexedDB) {
        this.formatos = new FormatosLocal(auth);
        this.formatos.setDb(db);
    }

    public getFormatos(){
        // Logger.log('Formatos@getFormatos()');
        for(let attr in this.formatos){
            if(
                String(attr) !== 'auth' &&
                String(attr) !== 'constructor' &&
                String(attr) !== 'data' &&
                String(attr) !== 'getVicImp' &&
                String(attr) !== 'setDataF1003' &&
                String(attr) !== 'setDataF1004' &&
                String(attr) !== 'setDataF1005' &&
                String(attr) !== 'setCasoInfo' &&
                String(attr) !== 'setVictimaInfo' &&
                String(attr) !== 'setDataF1008' &&
                String(attr) !== 'setDataF1009' &&
                String(attr) !== 'setDataF1010' &&
                String(attr) !== 'setDataF1011' &&
                String(attr) !== 'findHerenciaPersonasPredenuncia' &&
                String(attr) !== 'findVictimas' &&
                String(attr) !== 'findImputados' &&
                String(attr) !== 'setDataF1007' &&
                String(attr) !== 'findHerenciaNombresVictimas' &&
                String(attr) !== 'getListasPersonas'
                ){
                Logger.log('-> Cargar formato: ', attr);
                if(this.formatos[attr].path){
                    JSZipUtils.getBinaryContent(this.formatos[attr].path, (error, response) => {
                        this.formatos[attr].file = response;
                        this.formatos[attr].copy = new JSZip(response);
                        // Logger.log('-> Formato cargado')
                        // Logger.log('-> Response', response)
                        // Logger.log('-> Error', error)
                        // Logger.log('-> Formato', this.formatos[attr]);
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
        const copy = this.formatos[_formato].copy;
        doc.loadZip(copy);
        doc.setData(this.formatos.data);
        Logger.log('-> Templater', doc);
        // Logger.log('-> Copy', copy);
        // Logger.log('-> Original', this.formatos[_formato].file);
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
        this.formatos[_formato].copy = new JSZip(this.formatos[_formato].file);
        return out;
    }

}

export class FormatosLocal {

    db: CIndexedDB;

    setDb(db){
        this.db = db;
    }

    constructor(
        private auth: AuthenticationService
    ){}

    public F1_003 = {
        'path': environment.app.host+'/assets/formatos/F1_003_Lectura_De_Derechos_De_La_Victima.docx',
        'nombre': 'F1-003 LECTURA DE DERECHOS DE LA VÍCTIMA',
        'nameEcm': 'LECTURA DE DERECHOS DE LA VÍCTIMA',
        'file': null,
        'copy': null,
        'index': 0,
        'data': null
    };
    public F1_004= {
        'path': environment.app.host+'/assets/formatos/F1_004_Registro_Presencial.docx',
        'nombre': 'F1-004 REGISTRO PRESENCIAL',
        'nameEcm': 'REGISTRO PRESENCIAL',
        'file': null,
        'copy': null,
        'index': 0,
        'data': null
    };
    public F1_005 = {
        'path': environment.app.host+'/assets/formatos/F1_005_Registro_De_Recepcion_De_Llamada.docx',
        'nombre': 'F1-005 REGISTRO DE RECEPCIÓN DE LLAMADA',
        'nameEcm': 'REGISTRO DE RECEPCIÓN DE LLAMADA',
        'file': null,
        'copy': null,
        'index': 0,
        'data': null
    };

    // Formato de entrevista
    public F1_008 = {
        'path': environment.app.host+'/assets/formatos/F1_008_Entrevista.docx',
        'nombre': 'F1-008 ENTREVISTA',
        'nameEcm': 'ENTREVISTA',
        'file': null,
        'copy': null,
        'index': 0,
        'data': null
    };

    // Formato de solicitud pericial
    public F1_009 = {
        'path': environment.app.host+'/assets/formatos/F1_009_Oficio_Solicitud_A_Servicios_Periciales.docx',
        'nombre': 'F1-009 OFICIO SOLICITUD A SERVICIOS PERICIALES',
        'nameEcm': 'OFICIO SOLICITUD A SERVICIOS PERICIALES',
        'file': null,
        'copy': null,
        'index': 0,
        'data': null
    };
    public F1_010 = {
        'path': environment.app.host+'/assets/formatos/F1_010_Solicitud_Examen_Psicofisico.docx',
        'nombre': 'F1-010 SOLICITUD EXAMEN PSICOFÍSICO',
        'nameEcm': 'SOLICITUD EXAMEN PSICOFÍSICO',
        'file': null,
        'copy': null,
        'index': 0,
        'data': null
    };

    // Formato de solicitud policia ministerial
    public F1_011 = {
        'path': environment.app.host+'/assets/formatos/F1_011_Oficio_Solicitud_A_Policia_Ministerial.docx',
        'nombre': 'F1-011 OFICIO SOLICITUD A POLICIA MINISTERIAL',
        'nameEcm': 'OFICIO SOLICITUD A POLICIA MINISTERIAL',
        'file': null,
        'copy': null,
        'index': 0,
        'data': null
    };
    public F1_021 = {
        'path': environment.app.host+'/assets/formatos/F1_021_Oficio_Solicitud_A_Policia_Ministerial_Sin_Apercibimiento.docx',
        'nombre': 'F1-021 OFICIO SOLICITUD A POLICIA MINISTERIAL SIN APERCIBIMIENTO',
        'nameEcm': 'OFICIO SOLICITUD A POLICIA MINISTERIAL SIN APERCIBIMIENTO',
        'file': null,
        'copy': null,
        'index': 0,
        'data': null
    };

    // Acuerdo de inicio
    public F1_015_016 = {
        'path': environment.app.host+'/assets/formatos/F1_016_Y_F1_015_Formato_De_Acuerdo_De_Inicio.docx',
        'nombre': 'F1-016 Y F1-015 FORMATO DE ACUERDO DE INICIO',
        'nameEcm': 'FORMATO DE ACUERDO DE INICIO',
        'file': null,
        'copy': null,
        'index': 0,
        'data': null
    };
    public F1_007 = {
        'path': environment.app.host+'/assets/formatos/F1_007_Caratula.docx',
        'nombre': 'F1-007 CARÁTULA',
        'nameEcm': 'CARÁTULA',
        'file': null,
        'copy': null,
        'index': 0,
        'data': null
    };

    public F2_117 = {
        'path': environment.app.host+'/assets/formatos/F2_117_Registro_De_Derivacion_A_La_Unidad_De_Mecanismos_Alternativos.docx',
        'nombre': 'F2-117 REGISTRO DE DERIVACION A LA UNIDAD DE MECANISMOS ALTERNATIVOS',
        'nameEcm': 'REGISTRO DE DERIVACION A LA UNIDAD DE MECANISMOS ALTERNATIVOS',
        'file': null,
        'copy': null,
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



    public data = this.getDatos();

    public setDataF1003(_caso) {
        
        Logger.log('Formatos@setDataF1003', _caso);
        const identificaciones = [];
        const foliosIdentificacion = [];
        const predenuncia =  _caso.predenuncias;
        let atributosPersona = {};
        let personas = [];

        if (predenuncia.heredar) {
            personas = this.findHerenciaPersonasPredenuncia(_caso)
        } else {
            personas = this.findVictimas(_caso);
        }
        this.db.get('catalogos','idioma_identificacion').then(idioma_identificacion => {
            if (idioma_identificacion){
                atributosPersona = this.getListasPersonas(personas);
                let lista = idioma_identificacion['arreglo'] as any[]; 
                personas.forEach(o => {
                    let identificacion = lista.filter(e => { 
                        return e.id == o.persona.idiomaIdentificacion.id;
                    });
                    if (identificacion.length>0) {
                        identificaciones.push(identificacion[0].identificacion);
                    }
                    if (o.persona.folioIdentificacion) {
                        foliosIdentificacion.push(o.persona.folioIdentificacion);
                    }

                    Logger.logDarkColor(' identificaciones  ','cyan',identificaciones , o.persona.idiomaIdentificacion.id, identificacion);
                });
        
                
                this.setCasoInfo(_caso);
                this.data['xVictima'] = atributosPersona['nombres'].toLocaleString();
                this.data['xVictimaFirma'] = atributosPersona['nombres'].toLocaleString().toLocaleUpperCase();
                this.data['xSeIdentificaConFirma'] = identificaciones ? identificaciones.toLocaleString() : '';
                this.data['xFolioVictimaFirma'] = foliosIdentificacion ? foliosIdentificacion.toLocaleString() : '';
                this.data['xFolioDocumento'] = !predenuncia ? '' :(predenuncia.noFolioConstancia ? predenuncia.noFolioConstancia  : '');
                this.data['xHablaEspaniol'] = !predenuncia ? '' :(predenuncia.hablaEspaniol ? 'Sí' : 'No');
                this.data['xIdiomaLengua'] = !predenuncia.lenguaIdioma ? '' : predenuncia.lenguaIdioma;
                this.data['xInterprete'] = !predenuncia ? '' :(predenuncia.nombreInterprete ? predenuncia.nombreInterprete  : '');
                this.data['xComprendioDerechos'] = !predenuncia ? '' :(predenuncia.compredioDerechos ? 'Sí' : 'No');
                this.data['xCopiaDerechos'] = !predenuncia ? '' :(predenuncia.proporcionoCopia ? 'Sí' : 'No');
        
                this.data['xCargoEmisorFirma']        = this.auth.user.cargo.toLocaleUpperCase();
                this.data['xNombreEmisorFirma']       = this.auth.user.nombreCompleto.toLocaleUpperCase();
                this.data['xAdscripcionEmisorFirma']  = this.auth.user.agenciaCompleto.toLocaleUpperCase();
            }
        });
    }

    public setDataF1004(_caso) {
        Logger.log('Formatos@setDataF1004', _caso);
        
        const predenuncia = _caso.predenuncias;
        let personas = [];
        let sexos = [];
        let ocupaciones = [];
        let religiones = [];
        let nacionalidades = [];
        let estadosCiviles = [];
        let escolaridades = [];
        let identificaciones = [];
        let domicilios = [];
        let lugar = '';

        if (predenuncia.heredar) {
            personas = this.findHerenciaPersonasPredenuncia(_caso)
            lugar = predenuncia.lugarHechosHeredar;
        } else {
            personas = this.findVictimas(_caso);
            lugar = predenuncia.lugarHechos
        }
        const atributosPersona = this.getListasPersonas(personas);

        this.db.list('catalogos').then(catalogos => {
            if(catalogos){
                let lista = catalogos as any[];
                let sexo;
                let ocupacion;
                let religion;
                let escolaridad;
                let estadoCivil;
                let pais;
                let estado;
                let municipio;
                let identificacion;
                lista.forEach(catalogo => {
                    if(catalogo['id'] == "sexo"){
                        sexo = catalogo['arreglo'];
                        Logger.log("catálogo de sexos:",sexo);
                    }
                    if(catalogo['id'] == "ocupacion"){
                        ocupacion = catalogo['arreglo'];
                    }
                    if(catalogo['id'] == "nacionalidad_religion"){
                        religion = catalogo['arreglo'] as any[];
                    }
                    if(catalogo['id'] == "escolaridad"){
                        escolaridad = catalogo['arreglo'];
                    }
                    if(catalogo['id'] == "estado_civil"){
                        estadoCivil = catalogo['arreglo'];
                    }
                    if(catalogo['id'] == "pais"){
                        pais = catalogo['arreglo'];
                    }
                    if(catalogo['id'] == "estado"){
                        estado = catalogo['arreglo'] as any[];
                    }
                    if(catalogo['id'] == "municipio"){
                        municipio = catalogo['arreglo'] as any[];
                    }
                    if(catalogo['id'] == 'idioma_identificacion'){
                        identificacion = catalogo['arreglo'] as any[];
                    }
                });
        
                personas.forEach(o => {
                    if(o.persona.sexo){
                        sexos.push(sexo[o.persona.sexo.id]);
                    }
                    if(o.persona.ocupacion){
                        ocupaciones.push(ocupacion[o.persona.ocupacion.id]);
                    }
                    if(o.persona.escolaridad){
                        escolaridades.push(escolaridad[o.persona.escolaridad.id]);
                    }
                    if(o.persona.estadoCivil){
                        estadosCiviles.push(estadoCivil[o.persona.estadoCivil.id]);
                    }
                    if(o.persona.pais){
                        let domicilio;
                        if(o.persona.municipio){
                            let value = municipio.filter(e => { 
                                return e.id == o.persona.municipio.id;
                            });
                            if (value.length>0) {
                                domicilio = value[0].nombre+' ';
                            }
                        } else {
                            domicilio += (o.persona.municipioNacimientoOtro ? o.persona.municipioNacimientoOtro+' ' : '')
                        }
                        if(o.persona.estado){
                            let value = estado.filter(e => { 
                                return e.id == o.persona.estado.id;
                            });
                            if (value.length>0) {
                                domicilio += value[0].nombre+' ';
                            }
                        } else {
                            domicilio += (o.persona.estadoNacimientoOtro ? o.persona.estadoNacimientoOtro+' ' : '')
                        }
                        domicilio    += pais[o.persona.pais.id];
                        domicilios.push(domicilio);
                    }
                    if(o.persona.idiomaIdentificacion){
                        let value = identificacion.filter(e => { 
                            return e.id == o.persona.idiomaIdentificacion.id;
                        });
                        if (value.length>0) {
                            identificaciones.push(value[0].identificacion);
                        }
                    }
                    if(o.persona.nacionalidadReligion){
                        let value = religion.filter(e => { 
                            return e.id == o.persona.nacionalidadReligion.id;
                        });
                        Logger.log("------> nacionalidadReligion",value);
                        if (value.length>0) {
                            religiones.push(value[0].religion);
                            nacionalidades.push(value[0].nacionalidad);
                        }
                    }
                });
                Logger.log("Sexos de personas en herencia:",sexos);
            }

            this.setCasoInfo(_caso);
            this.data['xNombreUsuario'] = atributosPersona['nombres'].toLocaleString();
            this.data['xOriginario'] = domicilios.toLocaleString();
            this.data['xEdad'] = atributosPersona['edades'].toLocaleString();
            this.data['xSexo'] = sexos.toLocaleString();
            this.data['xDomicilio'] = atributosPersona['domicilios'].toLocaleString();
            this.data['xCalidadUsuarioPersona'] = atributosPersona['calidadPersonas'].toLocaleString();
            this.data['xTipoPersona'] = atributosPersona['tiposPersonas'].toLocaleString();
            this.data['xFechaNacimiento'] = atributosPersona['fechasNacimientos'].toLocaleString();
            this.data['xRFC'] = atributosPersona['rfcs'].toLocaleString();
            this.data['xCURP'] = atributosPersona['curps'].toLocaleString();
            this.data['xEstadoCivil'] = estadosCiviles.toLocaleString();
            this.data['xOcupacion'] = ocupaciones.toLocaleString();
            this.data['xEscolaridad'] = escolaridades.toLocaleString();
            this.data['xReligion'] = religiones.toLocaleString();
            this.data['xNacionalidad'] = nacionalidades.toLocaleString();
            this.data['xNumeroTelefonico'] = atributosPersona['noParticulares'].toLocaleString();
            this.data['xNumeroMovil'] = atributosPersona['noMoviles'].toLocaleString();
            this.data['xSeIdentificaCon'] = identificaciones.toLocaleString();
            this.data['xFolioIdentificacion'] = atributosPersona['folios'].toLocaleString();

            if (_caso.predenuncias ) {
                // this.data['xFolioIdentificacion'] = (_caso.predenuncias.noFolioConstancia ? _caso.predenuncias.noFolioConstancia : '');
                this.data['xHechosNarrados'] = (_caso.predenuncias.hechosNarrados ? _caso.predenuncias.hechosNarrados : '');
                this.data['xConclusionHechos'] = (_caso.predenuncias.conclusion ? _caso.predenuncias.conclusion : '');
                this.data['xLugarHechos'] = (lugar ? lugar : '');
                this.data['xCanalizacion'] = (_caso.predenuncias.canalizacion ? 'Sí' : 'No');
                this.data['xInstitucionCanalizacion'] = (_caso.predenuncias.institucion ? _caso.predenuncias.institucion : '');
                this.data['xMotivoCanalizacion'] = (_caso.predenuncias.motivoCanalizacion ? _caso.predenuncias.motivoCanalizacion : '');
                this.data['xFechaCanalizacion'] = (_caso.predenuncias.fechaCanalizacion ? moment(_caso.predenuncias.fechaCanalizacion).format('LL'): '');
                this.data['xHoraCanalizacion'] = (_caso.predenuncias.fechaCanalizacion ? moment(_caso.predenuncias.fechaCanalizacion).format('HH:mm') : '');
                this.data['xNombreCausoHecho'] = (_caso.predenuncias.nombreCausante ? _caso.predenuncias.nombreCausante : '');
                this.data['xDomicilioHechos'] = (_caso.predenuncias.domicilioCausante ? _caso.predenuncias.domicilioCausante : '');
                this.data['xObservaciones'] = (_caso.predenuncias.observaciones ? _caso.predenuncias.observaciones : '');
            }
        })
        
    }

    public setDataF1005(_caso) {
        console.log('<<< @setDataF1005 >>>', _caso);
        
        const predenuncia = _caso.predenuncias;
        let personas = [];
        let lugar = '';

        if (predenuncia.heredar) {
            personas = this.findHerenciaPersonasPredenuncia(_caso);
        } else {
            personas = this.findVictimas(_caso);
        }
        const atributosPersona = this.getListasPersonas(personas);

        this.setCasoInfo(_caso);
        this.data['xEdad'] = atributosPersona['edades'].toLocaleString();
        this.data['xEstadoCivil'] = atributosPersona['estadosCiviles'].toLocaleString();
        this.data['xOcupacion'] = atributosPersona['ocupaciones'].toLocaleString();
        this.data['xEscolaridad'] = atributosPersona['escolaridades'].toLocaleString();
        this.data['xOrientadorJuridicoFirma'] = this.auth.user.nombreCompleto.toLocaleUpperCase();
        this.data['xCargoEmisorFirma']        = this.auth.user.cargo.toLocaleUpperCase();
        this.data['xNumeroTelefonico'] = atributosPersona['noParticulares'].toLocaleString();
        this.data['xDomicilio'] = atributosPersona['domicilios'].toLocaleString();

        if (_caso.predenuncias) {
            this.db.get('catalogos','tipo_linea').then(tipoLinea => {
                
                if (tipoLinea && predenuncia.tipoLinea){
                    let lista = tipoLinea['arreglo'] as any[]; 
                    this.data['xTipoLineaTelefonica'] = lista[predenuncia.tipoLinea.id];
                } else {
                    this.data['xTipoLineaTelefonica'] = '';
                }   
                
                this.data['xTelefonoLlamando'] = (_caso.predenuncias.noTelefonico ? _caso.predenuncias.noTelefonico : '');
                this.data['xLugarLlamada'] = (_caso.predenuncias.lugarLlamada ? _caso.predenuncias.lugarLlamada : '');
                this.data['xNarracionHechos'] = (_caso.predenuncias.hechosNarrados ? _caso.predenuncias.hechosNarrados : '');
                this.data['xAsesoria'] = (_caso.predenuncias.comunicado ? _caso.predenuncias.comunicado : '');
                this.data['xHoraConclusionLlamada'] = (_caso.predenuncias.horaConclusionLlamada ? _caso.predenuncias.horaConclusionLlamada : '');
                this.data['xDuracionLlamada'] = (_caso.predenuncias.duracionLlamada ? _caso.predenuncias.duracionLlamada : '');
                this.data['xObservaciones'] = (_caso.predenuncias.observaciones ? _caso.predenuncias.observaciones : '');

            });
        }
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


public setDataF1007(_data){
  Logger.log('Formatos@setDataF1007', _data);
  
  let fecha = new Date()
  const meses = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  let delito = '';
  var dia  = fecha.getDate();
  var mes  = meses[fecha.getMonth()];
  var anio = fecha.getFullYear();
  var lugaresHallazgo = '';
  var lugaresHechos = '';
  var delitoHeredar

  if (_data.acuerdoInicio.heredar) {
      delitoHeredar = _data.acuerdoInicio.delito.id;
      for (let i=0; i < _data.delitoCaso.length; i++) {
          if (_data.delitoCaso[i].id == delitoHeredar) {
              delito = _data.delitoCaso[i].delito.nombre;
          }
      }
  } else {
      delito = _data.delitoPrincipal.nombre;
  }

  for (let i = 0; i < _data.lugares.length; i++) {
      if (_data.lugares[i].pais.id == _config.optionValue.idMexico) {
          if (_data.lugares[i].detalleLugar.tipoLugar == "LUGAR DE LOS HECHOS") {
              if (lugaresHechos == '') {
                  lugaresHechos = (_data.lugares[i] ? _data.lugares[i].calle : '')+' '+
                                  (_data.lugares[i].noExterior ? _data.lugares[i].noExterior : '')+' '+
                                  (_data.lugares[i].noInterior ? _data.lugares[i].noInterior : '')+' '+
                                  (_data.lugares[i] ? _data.lugares[i].colonia.nombre : '')+' '+
                                  (_data.lugares[i].cp ? _data.lugares[i].cp : '')+' '+
                                  (_data.lugares[i] ? _data.lugares[i].municipio.nombre : '')+' '+
                                  (_data.lugares[i] ? _data.lugares[i].estado.nombre : '')+' '+
                                  (_data.lugares[i] ? _data.lugares[i].pais.nombre : ''); 
              } else {
                  lugaresHechos += ', '+(_data.lugares[i] ? _data.lugares[i].calle : '')
                                  +' '+(_data.lugares[i].noExterior ? _data.lugares[i].noExterior : '')
                                  +' '+(_data.lugares[i].noInterior ? _data.lugares[i].noInterior : '')
                                  +' '+(_data.lugares[i] ? _data.lugares[i].colonia.nombre : '')
                                  +' '+(_data.lugares[i].cp ? _data.lugares[i].cp : '')
                                  +' '+(_data.lugares[i] ? _data.lugares[i].municipio.nombre : '')
                                  +' '+(_data.lugares[i] ? _data.lugares[i].estado.nombre : '')
                                  +' '+(_data.lugares[i] ? _data.lugares[i].pais.nombre : '');
              }
          } else {
              if (lugaresHallazgo == '') {
                  lugaresHallazgo = (_data.lugares[i] ? _data.lugares[i].calle : '')+' '+
                                  (_data.lugares[i].noExterior ? _data.lugares[i].noExterior : '')+' '+
                                  (_data.lugares[i].noInterior ? _data.lugares[i].noInterior : '')+' '+
                                  (_data.lugares[i] ? _data.lugares[i].colonia.nombre : '')+' '+
                                  (_data.lugares[i].cp ? _data.lugares[i].cp : '')+' '+
                                  (_data.lugares[i] ? _data.lugares[i].municipio.nombre : '')+' '+
                                  (_data.lugares[i] ? _data.lugares[i].estado.nombre : '')+' '+
                                  (_data.lugares[i] ? _data.lugares[i].pais.nombre : '');
              } else {
                  lugaresHallazgo += ', '+(_data.lugares[i] ? _data.lugares[i].calle : '')
                                    +', '+(_data.lugares[i].noExterior ? _data.lugares[i].noExterior : '')
                                    +', '+(_data.lugares[i].noInterior ? _data.lugares[i].noInterior : '')
                                    +', '+(_data.lugares[i] ? _data.lugares[i].colonia.nombre : '')
                                    +', '+(_data.lugares[i].cp ? _data.lugares[i].cp : '')
                                    +', '+(_data.lugares[i] ? _data.lugares[i].municipio.nombre : '')
                                    +', '+(_data.lugares[i] ? _data.lugares[i].estado.nombre : '')
                                    +', '+(_data.lugares[i] ? _data.lugares[i].pais.nombre : '');
              }
          }
      } else {
          if (_data.lugares[i].detalleLugar.tipoLugar == "LUGAR DE LOS HECHOS") {
              if (lugaresHechos == '') {
                  lugaresHechos = (_data.lugares[i] ? _data.lugares[i].calle : '')+' '+
                                  (_data.lugares[i].noExterior ? _data.lugares[i].noExterior : '')+' '+
                                  (_data.lugares[i].noInterior ? _data.lugares[i].noInterior : '')+' '+
                                  (_data.lugares[i] ? _data.lugares[i].coloniaOtro : '')+' '+
                                  (_data.lugares[i].cp ? _data.lugares[i].cp : '')+' '+
                                  (_data.lugares[i] ? _data.lugares[i].municipioOtro : '')+' '+
                                  (_data.lugares[i] ? _data.lugares[i].estadoOtro : '')+' '+
                                  (_data.lugares[i] ? _data.lugares[i].pais.nombre : ''); 
              } else {
                  lugaresHechos += ', '+(_data.lugares[i] ? _data.lugares[i].calle : '')
                                  +' '+(_data.lugares[i].noExterior ? _data.lugares[i].noExterior : '')
                                  +' '+(_data.lugares[i].noInterior ? _data.lugares[i].noInterior : '')
                                  +' '+(_data.lugares[i] ? _data.lugares[i].coloniaOtro : '')
                                  +' '+(_data.lugares[i].cp ? _data.lugares[i].cp : '')
                                  +' '+(_data.lugares[i] ? _data.lugares[i].municipioOtro : '')
                                  +' '+(_data.lugares[i] ? _data.lugares[i].estadoOtro : '')
                                  +' '+(_data.lugares[i] ? _data.lugares[i].pais.nombre : '');
              }
          } else {
              if (lugaresHallazgo == '') {
                  lugaresHallazgo = (_data.lugares[i] ? _data.lugares[i].calle : '')+' '+
                                    (_data.lugares[i].noExterior ? _data.lugares[i].noExterior : '')+' '+
                                    (_data.lugares[i].noInterior ? _data.lugares[i].noInterior : '')+' '+
                                    (_data.lugares[i] ? _data.lugares[i].coloniaOtro : '')+' '+
                                    (_data.lugares[i].cp ? _data.lugares[i].cp : '')+' '+
                                    (_data.lugares[i] ? _data.lugares[i].municipioOtro : '')+' '+
                                    (_data.lugares[i] ? _data.lugares[i].estadoOtro : '')+' '+
                                    (_data.lugares[i] ? _data.lugares[i].pais.nombre : '');  
              } else {
                  lugaresHallazgo += ', '+(_data.lugares[i] ? _data.lugares[i].calle : '')
                                    +' '+(_data.lugares[i].noExterior ? _data.lugares[i].noExterior : '')
                                    +' '+(_data.lugares[i].noInterior ? _data.lugares[i].noInterior : '')
                                    +' '+(_data.lugares[i] ? _data.lugares[i].coloniaOtro : '')
                                    +' '+(_data.lugares[i].cp ? _data.lugares[i].cp : '')
                                    +' '+(_data.lugares[i] ? _data.lugares[i].municipioOtro : '')
                                    +' '+(_data.lugares[i] ? _data.lugares[i].estadoOtro : '')
                                    +' '+(_data.lugares[i] ? _data.lugares[i].pais.nombre : '');
              }
          }
      }
  }

  const imp        = _config.optionValue.tipoInterviniente.imputado;    
  const impDesc    = _config.optionValue.tipoInterviniente.imputadoDesconocido;
  const vic        = _config.optionValue.tipoInterviniente.victima;
  const vicDesc    = _config.optionValue.tipoInterviniente.victimaDesconocido;
  const ofendido   = _config.optionValue.tipoInterviniente.ofendido;

  let nombresVictimas = '';
  let nombresImputados = '';

  for (let i = 0; i < _data.personaCasos.length; i++) {
       if (_data.personaCasos[i].tipoInterviniente.id == vic || _data.personaCasos[i].tipoInterviniente.id == vicDesc || _data.personaCasos[i].tipoInterviniente.id == ofendido) {
           if (_data.personaCasos[i].tipoInterviniente.id == vicDesc) {
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
       if (_data.personaCasos[i].tipoInterviniente.id == imp || _data.personaCasos[i].tipoInterviniente.id == impDesc) {
           if (_data.personaCasos[i].tipoInterviniente.id == impDesc) {
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

  this.data['xNUC']                = _data.nuc ? _data.nuc : '';
  this.data['xNIC']                = _data.nic ? _data.nic : '';

  this.data['xDia']                = dia.toString(); 
  this.data['xMes']                = mes.toString();
  this.data['xAnio']               = anio.toString();
  this.data['xHechoDelictivo']     = delito;
  this.data['xLugarHallazgo']      = lugaresHallazgo;  
  this.data['xLugarHechos']        = lugaresHechos;

  this.data['xVictima']            = nombresVictimas;
  this.data['xImputado']           = nombresImputados;

  this.data['xCargoEmisorFirma']   = this.auth.user.cargo;
  this.data['xNombreEmisorFirma']  = this.auth.user.nombreCompleto;

}

    public setDataF1008(_caso, _id){
        Logger.log('Formatos@setDataF1008', _caso);
        
        const entrevista = _caso.entrevistas.filter(o => o.id == _id)[0];

        this.db.get('catalogos','sexo').then(sexoCat => {
            let listSexo = sexoCat['arreglo'] as any[]; 

            const nombreEntrevistado = entrevista.heredar ? entrevista.nombreEntrevistadoHeredar : entrevista.nombreEntrevistado;
            const sexo = entrevista.heredar ? entrevista.sexoHeredar : (entrevista.sexo) ? listSexo[entrevista.sexo.id] : '';
            const fechaNacimiento = entrevista.heredar ? entrevista.fechaNacimientoHeredar : entrevista.fechaNacimiento;
            const nacionalidad = entrevista.heredar ? entrevista.nacionalidadHeredar : entrevista.nacionalidad;
            const originarioDe = entrevista.heredar ? entrevista.originarioDeHeredar : entrevista.originarioDe;
            const tipoIdentificacion = entrevista.heredar ? entrevista.tipoIdentificacionHeredar : entrevista.tipoIdentificacion;
            const emisorIdentificacion = entrevista.heredar ? entrevista.emisorIdentificacionHeredar : entrevista.emisorIdentificacion;
            const noIdentificacion = entrevista.heredar ? entrevista.noIdentificacionHeredar : entrevista.noIdentificacion;
            const curp = entrevista.heredar ? entrevista.curpHeredar : entrevista.curp;
            const rfc = entrevista.heredar ? entrevista.rfcHeredar : entrevista.rfc;
            const sabeLeerEscribir = entrevista.heredar ? entrevista.sabeLeerEscribirHeredar : (entrevista.sabeLeerEscribir) ? 'Sí' : 'No';
            const gradoEscolaridad = entrevista.heredar ? entrevista.gradoEscolaridadHeredar : entrevista.gradoEscolaridad;
            const ocupacion = entrevista.heredar ? entrevista.ocupacionHeredar : entrevista.ocupacion;
            const lugarOcupacion = entrevista.heredar ? entrevista.lugarOcupacionHeredar : entrevista.lugarOcupacion;
            const estadoCivil = entrevista.heredar ? entrevista.estadoCivilHeredar : entrevista.estadoCivil;
            const salarioSemanal = entrevista.heredar ? entrevista.salarioHeredar : entrevista.salarioSemanal;       
            const noTelefonoCelular = entrevista.heredar ? entrevista.noTelefonoCelularHeredar : entrevista.noTelefonoParticular;
            const noTelefonoParticular = entrevista.heredar ? entrevista.noTelefonoParticularHeredar : entrevista.noTelefonoParticular;
            const correoElectronico = entrevista.heredar ? entrevista.correoElectronicoHeredar : entrevista.correoElectronico;
            const calidadUsuarioPersonas = entrevista.heredar ? entrevista.calidadIntervinienteHeredar : (entrevista.tipoInterviniente) ? entrevista.tipoInterviniente.tipo : '';
            const nombreRepresentanteLegal = entrevista.nombreRepresentanteLegal;
            let direccion = "";
                direccion += entrevista.heredar ? 
                             (entrevista.calleHeredar ? entrevista.calleHeredar+" " : "") : 
                             (entrevista.calle ? entrevista.calle+" " : "");
                direccion += entrevista.heredar ? 
                             (entrevista.noExteriorHeredar ? entrevista.noExteriorHeredar+" " : "") : 
                             (entrevista.noExterior ? entrevista.noExterior+" " : "");
                direccion += entrevista.heredar ? 
                             (entrevista.noInteriorHeredar ? entrevista.noInteriorHeredar+" " : "") : 
                             (entrevista.noInterior ? entrevista.noInterior+" " : "");
                direccion += entrevista.heredar ? 
                             (entrevista.coloniaHeredar ? entrevista.coloniaHeredar+" " : "") : 
                             (entrevista.colonia ? entrevista.colonia+" " : "");
                direccion += entrevista.heredar ? 
                             (entrevista.cpHeredar ? entrevista.cpHeredar+" " : "") : 
                             (entrevista.cp ? entrevista.cp+" " : "");
                direccion += entrevista.heredar ? 
                             (entrevista.municipioHeredar ? entrevista.municipioHeredar+" " : "") : 
                             (entrevista.municipio ? entrevista.municipio+" " : "");
                direccion += entrevista.heredar ? 
                             (entrevista.estadoHeredar ? entrevista.estadoHeredar+" " : "") : 
                             (entrevista.estado ? entrevista.estado : "");
                
            // const relacionEntrevistado;

            let fecha = new Date(entrevista.created);
            console.log('<<< FECHA ENTREVISTA >>>', fecha);
            let fechaAtencion = fecha.getDate()+' de '+this.getMes(fecha.getMonth())+' de '+fecha.getFullYear();
            let horaAtencion = fecha.getHours()+':'+fecha.getMinutes();
             
            this.data['xNUC']= _caso.nuc ? _caso.nuc : '';
            this.data['xNIC']= _caso.nic ? _caso.nic : '';
            this.data['xFechaAtencion']=entrevista.created? fechaAtencion :'';
            this.data['xHoraAtencion']= entrevista.created? horaAtencion :'';
            this.data['xNombreAutoridadEntrevista']= entrevista.autoridadRealizaEntrevista? entrevista.autoridadRealizaEntrevista:'';
            this.data['xLugarEntrevista']= entrevista.lugarRealizaEntrevista? entrevista.lugarRealizaEntrevista:'';

            this.data['xNombreEntrevistado']= nombreEntrevistado ? nombreEntrevistado:'';
            this.data['xNombreEntrevistadoFirma']= nombreEntrevistado ? nombreEntrevistado:'';
            this.data['xSexo']= sexo ? sexo:'';
            this.data['xFechaNacimiento']= fechaNacimiento ? fechaNacimiento:'';
            this.data['xNacionalidad']= nacionalidad ? nacionalidad:'';
            this.data['xOriginario']= originarioDe ? originarioDe:'';
            this.data['xCalidadUsuarioPersona']= calidadUsuarioPersonas ? calidadUsuarioPersonas : '';
            this.data['xTipoIdentificacion'] = tipoIdentificacion ? tipoIdentificacion:'';
            this.data['xEmisorIdentificacion'] = emisorIdentificacion ? emisorIdentificacion:'';
            this.data['xNumeroIdentificacion'] = noIdentificacion ? noIdentificacion:'';
            this.data['xCURP'] = curp ? curp : '';
            this.data['xRFC'] = rfc ? rfc : '';
            this.data['xSabeLeerEscribir'] = sabeLeerEscribir ? sabeLeerEscribir :'';
            this.data['xEscolaridad'] = gradoEscolaridad ? gradoEscolaridad:'';
            this.data['xOcupacion'] = ocupacion ? ocupacion:'';
            this.data['xLugarOcupacion'] = lugarOcupacion ? lugarOcupacion:'';
            this.data['xEstadoCivil'] = estadoCivil ? estadoCivil:'';
            this.data['xSalarioSemanal'] = salarioSemanal ? salarioSemanal:'';
            // this.data['xCalle'] = calle ? calle:'';
            // this.data['xNumExterior'] = noExterior ? noExterior:'';
            // this.data['xNumInterior'] = noInterior ? noInterior:'';
            // this.data['xColonia'] = colonia ? colonia:'';
            // this.data['xCP'] = cp ? cp:'';
            // this.data['xPoblacion']= municipio ? municipio:'';
            // this.data['xEstado'] = estado ? estado:'';
            this.data['xDireccion'] = direccion? direccion:'';
            this.data['xNumeroTelefonico'] = noTelefonoParticular ? noTelefonoParticular:'';
            this.data['xNumeroMovil'] = noTelefonoParticular ? noTelefonoParticular:'';
            this.data['xCorreoElectronico'] = correoElectronico ? correoElectronico:'';

            this.data['xRepresentanteLegal'] = entrevista.tieneRepresentanteLegal ? 'Sí' : 'No';
            this.data['xNombreRepresentanteLegal']= entrevista.nombreRepresentanteLegal ? entrevista.nombreRepresentanteLegal:'';
            this.data['xUsoMedioTecnologico']= entrevista.medioTecnologicoRegistro ? 'Sí' : 'No';
            this.data['xMedioTecnologico']= entrevista.medioTecnologicoUtilizado ? entrevista.medioTecnologicoUtilizado :'';;
            this.data['xUsoMedioTecnico']= entrevista.medioTecnicoRegistro ? 'Sí' :'No';
            this.data['xMedioTecnico']= entrevista.medioTecnicoUtilizado? entrevista.medioTecnicoUtilizado:'';
            this.data['xNarracionHechos']= entrevista.narracionHechos? entrevista.narracionHechos:'';
            this.data['xNombreEntrevistadoFirma']= nombreEntrevistado ? nombreEntrevistado : '';
            this.data['xEstadoMigratorio']= entrevista.estadoMigratorio ? entrevista.estadoMigratorio:'';
            this.data['xRelacionEntrevistadoPartes'] = entrevista.relacionEntrevistado ? entrevista.relacionEntrevistado : '';

            this.data['xCargoEmisorFirma']        = this.auth.user.cargo.toLocaleUpperCase();
            this.data['xNombreEmisorFirma']       = this.auth.user.nombreCompleto.toLocaleUpperCase();
            this.data['xAdscripcionEmisorFirma']  = this.auth.user.agenciaCompleto.toLocaleUpperCase();
        });
    }

    public setDataF1009(_data,_id_solicitud){
        Logger.log('Formatos@setDataF1009', _data);
        // let nombresVictimas = '';
        // let nombresImputados = '';

        // if (_data.heredar) {
        //     nombresVictimas = this.getVicImp(_data, _id_solicitud, false);
        //     nombresImputados = this.getVicImp(_data, _id_solicitud, true);
        // } else {
        //     for (let i = 0; i < _data.personaCasos.length; i++) {
        //         if (_data.personaCasos[i].tipoInterviniente.id == _config.optionValue.tipoInterviniente.victima || _data.personaCasos[i].tipoInterviniente.id == _config.optionValue.tipoInterviniente.victimaDesconocido) {
        //             if (_data.personaCasos[i].tipoInterviniente.id == _config.optionValue.tipoInterviniente.victimaDesconocido) {
        //                 if (nombresVictimas == '') {
        //                     nombresVictimas = 'Identidad desconocida';
        //                 } else {
        //                     nombresVictimas += ', '+ 'Identidad desconocida';
        //                 }   
        //             } else {
        //                 if (nombresVictimas == '') {
        //                     nombresVictimas = _data.personaCasos[i].persona.nombre+' '+_data.personaCasos[i].persona.paterno+' '+(_data.personaCasos[i].persona.materno ? _data.personaCasos[i].persona.materno : '');
        //                 } else {
        //                     nombresVictimas += ', '+ _data.personaCasos[i].persona.nombre+' '+_data.personaCasos[i].persona.paterno+' '+(_data.personaCasos[i].persona.materno ? _data.personaCasos[i].persona.materno : '');
        //                 }                   
        //             }
        //         }
        //     }

        //     for (let i = 0; i < _data.personaCasos.length; i++) {
        //         if (_data.personaCasos[i].tipoInterviniente.id == _config.optionValue.tipoInterviniente.imputado || _data.personaCasos[i].tipoInterviniente.id == _config.optionValue.tipoInterviniente.imputadoDesconocido) {
        //             if (_data.personaCasos[i].tipoInterviniente.id == _config.optionValue.tipoInterviniente.imputadoDesconocido) {
        //                 if (nombresImputados == '') {
        //                     nombresImputados = 'Quién resulte responsable';
        //                 } else {
        //                     nombresImputados += ', '+ 'Quién resulte responsable';
        //                 }     
        //             } else {
        //                 if (nombresImputados == '') {
        //                     nombresImputados = _data.personaCasos[i].persona.nombre+' '+_data.personaCasos[i].persona.paterno+' '+(_data.personaCasos[i].persona.materno ? _data.personaCasos[i].persona.materno : '');
        //                 } else {
        //                     nombresImputados += ', '+ _data.personaCasos[i].persona.nombre+' '+_data.personaCasos[i].persona.paterno+' '+(_data.personaCasos[i].persona.materno ? _data.personaCasos[i].persona.materno : '');
        //                 }                   
        //             }
        //         }
        //     }
        // }

        let pericial;
        let imputados = [];
        let victimas  = [];
        //let tipoExamen = '';
        let peritoMateria = '';

        _data.solicitudPrePericiales.forEach(solicitud => {
            if(solicitud.id===_id_solicitud){
                pericial=solicitud;
            }
        });

        var date = new Date();

        if (date) {
            var dia  = date.getDate();
            var mes  = date.getMonth();
            var anio = date.getFullYear();
        }

        if (pericial.heredar) {
            const personas = this.findHerenciaPersonas(_data, pericial)
            victimas = personas['victimas'];
            imputados = personas['imputados'];
        } else {
            victimas = this.findVictimas(_data);
            imputados = this.findImputados(_data);
        }
        this.db.get('catalogos','perito_materia').then(perito_materia => {
            if (perito_materia && pericial.peritoMateria){
                let lista = perito_materia['arreglo'] as any[]; 
                peritoMateria = lista[pericial.peritoMateria.id];
            }
            this.data['xNUC']                     = _data.nuc? _data.nuc:'';
            this.data['xNIC']                     = _data.nic? _data.nic:'';
            this.data['xHechoDelictivo']          = _data.delitoPrincipal.nombre ? _data.delitoPrincipal.nombre : '';
            this.data['xVictima']                 = this.getListasPersonas(victimas)['nombres'].toLocaleString().toUpperCase();
            this.data['xImputado']                = this.getListasPersonas(imputados)['nombres'].toLocaleString().toUpperCase();
            this.data['xOficio']                  = pericial.noOficio ? pericial.noOficio : '';
            this.data['xEstado']                  = 'Estado de México';
            this.data['xPoblacion']               = this.auth.user.municipio;
            this.data['xDia']                     = dia ? dia.toString() : '';
            this.data['xMes']                     = mes ? this.getMes(mes) : '';
            this.data['xAnio']                    = anio ? anio.toString(): '';
            this.data['xSolicitaPerito']          = peritoMateria ? peritoMateria : '';
            this.data['xFinalidadRequerimiento']  = pericial.finalidad?pericial.finalidad:'';
            this.data['xPlazoRendirInformes']     = pericial.plazoDias? pericial.plazoDias: '';
            this.data['xApercibimiento']          = pericial.apercibimiento ? pericial.apercibimiento: '';
            this.data['xDirectorInstituto']       = pericial.directorInstituto ? pericial.directorInstituto.toUpperCase() : '';
            this.data['xNombreEmisorFirma']       = this.auth.user.nombreCompleto.toUpperCase();
            this.data['xAdscripcionEmisorFirma']  = this.auth.user.agenciaCompleto.toUpperCase();
            this.data['xCargoEmisorFirma']        = this.auth.user.cargo.toUpperCase();
            Logger.log('formato',this.data)
        });
    }

public setDataF1516(_data) {
    console.log('<<< Formato F1516 caso >>>', _data);
    
    let victimasNombres = '';
    let victimas = [];
    let victimasHeredar = [];
    const vic        = _config.optionValue.tipoInterviniente.victima;
    const vicDesc    = _config.optionValue.tipoInterviniente.victimaDesconocido;
    const ofendido   = _config.optionValue.tipoInterviniente.ofendido;

    if (_data.acuerdoInicio.heredar) {
        for (let i=0; i < _data.acuerdoInicio.personas[i]; i++) {
            victimas.push(_data.acuerdoInicio.personas[i].personaCaso.id);
        }

        for (var i=0; i < victimas.length; i++) {
            for (var j=0; j < _data.personaCasos.length; j++) {
                if(_data.personaCasos[j].id == victimas[i]) {
                    victimasHeredar.push(_data.personaCasos[j]);
                }
            }
        }

        for (let i; i < victimasHeredar.length; i++) {
            if(victimasHeredar[i].tipoInterviniente.id == vic || victimasHeredar[i].tipoInterviniente.id == vicDesc || victimasHeredar[i].tipoInterviniente.id == ofendido) {
                victimas.push(victimasHeredar[i]);
            }
        }

        if (victimas.length == 0) {
            victimas = this.findVictimas(_data);
        }

        
    } else {
        victimas = this.findVictimas(_data);
    }

    console.log('<<< victimas acuerdo >>>', victimas);

    for (i=0; i < victimas.length; i++) {
        if (victimas[i].tipoInterviniente.id == vicDesc) {
            if (victimasNombres == '') {
                victimasNombres = 'Identidad desconocida';
            } else {
                victimasNombres += ', '+'Identidad desconocida';
            }
        } else {
            if (victimasNombres == '') {
                victimasNombres = victimas[i].persona.nombre+' '+victimas[i].persona.paterno+' '+(victimas[i].persona.materno ? victimas[i].persona.materno : '');
            } else {
                victimasNombres += ', '+victimas[i].persona.nombre+' '+victimas[i].persona.paterno+' '+(victimas[i].persona.materno ? victimas[i].persona.materno : '');
            }

        }
    }

    console.log('<<< Nombres victimas acuerdos >>>',victimasNombres);

    this.setCasoInfo(_data);

    this.data['xEstado']                 = 'Estado de México'; 
    this.data['xPoblacion']              = this.auth.user.municipio;
    this.data['xRecibioLlamada']         = _data.acuerdoInicio.presentoLlamada ? _data.acuerdoInicio.presentoLlamada.nombre: ''; 
    console.log('<<< recibio llamada >>>', this.data['xRecibioLlamada'], _data.acuerdoInicio.presentoLlamada.nombre)
    this.data['xVictima']                = victimasNombres;
    this.data['xManifesto']              = _data.acuerdoInicio.manifesto ? _data.acuerdoInicio.manifesto : '';
    this.data['xNarracionHechos']        = _data.acuerdoInicio.sintesisHechos ? _data.acuerdoInicio.sintesisHechos : '';
    this.data['xNombreEmisorFirma']      = this.auth.user.nombreCompleto;
    this.data['xCargoEmisorFirma']       = this.auth.user.cargo;
    this.data['xAdscripcionEmisorFirma'] = this.auth.user.agenciaCompleto;
    


}
public setDataF2117(_data) {
    console.log('<<< @setDataF2117 >>>', _data);
    
    let victimasNombres = '';
    let victimas = [];
    let victimasHeredar = [];
    const vic        = _config.optionValue.tipoInterviniente.victima;
    const vicDesc    = _config.optionValue.tipoInterviniente.victimaDesconocido;
    const ofendido   = _config.optionValue.tipoInterviniente.ofendido;
    var changeB =true;

    if (_data.acuerdoInicio.heredar) {
        for (let i=0; i < _data.acuerdoInicio.personas[i]; i++) {
            victimas.push(_data.acuerdoInicio.personas[i].personaCaso.id);
        }

        for (var i=0; i < victimas.length; i++) {
            for (var j=0; j < _data.personaCasos.length; j++) {
                if(_data.personaCasos[j].id == victimas[i]) {
                    victimasHeredar.push(_data.personaCasos[j]);
                }
            }
        }

        for (let i; i < victimasHeredar.length; i++) {
            if(victimasHeredar[i].tipoInterviniente.id == vic || victimasHeredar[i].tipoInterviniente.id == vicDesc || victimasHeredar[i].tipoInterviniente.id == ofendido) {
                victimas.push(victimasHeredar[i]);
            }
        }

        if (victimas.length == 0) {
            victimas = this.findVictimas(_data);
        }

        
    } else {
        victimasNombres = _data.acuerdoInicio.nombrePersonaAcepta ? _data.acuerdoInicio.nombrePersonaAcepta : '';
        changeB =false;
    }

    console.log('<<< victimas acuerdo >>>', victimas);

    if (changeB) {
        for (i=0; i < victimas.length; i++) {
            if (victimas[i].tipoInterviniente.id == vicDesc) {
                if (victimasNombres == '') {
                    victimasNombres = 'Identidad desconocida';
                } else {
                    victimasNombres += ', '+'Identidad desconocida';
                }
            } else {
                if (victimasNombres == '') {
                    victimasNombres = victimas[i].persona.nombre+' '+victimas[i].persona.paterno+' '+(victimas[i].persona.materno ? victimas[i].persona.materno : '');
                } else {
                    victimasNombres += ', '+victimas[i].persona.nombre+' '+victimas[i].persona.paterno+' '+(victimas[i].persona.materno ? victimas[i].persona.materno : '');
                }

            }
        }
    }

    console.log('<<< Nombres victimas acuerdos >>>',victimasNombres);

    this.setCasoInfo(_data);

    this.data['xVictima'] = victimasNombres;
    this.data['xNombreEmisorFirma']      = this.auth.user.nombreCompleto.toUpperCase();
    this.data['xCargoEmisorFirma']       = this.auth.user.cargo.toUpperCase();
    this.data['xAdscripcionEmisorFirma'] = this.auth.user.agenciaCompleto.toUpperCase();

}

    public setDataF1010(_data,_id_solicitud){
        Logger.log('Formatos@setDataF1010', _data);
        
        let examen;
        let victimas;
        let imputados;
        let tipoExamen = '';

        _data.solicitudPrePericiales.forEach(solicitud => {
            if(solicitud.id===_id_solicitud){
                examen=solicitud;
            }
        });

        if (examen.heredar) {
            const personas = this.findHerenciaPersonas(_data, examen)
            victimas = personas['victimas'];
            imputados = personas['imputados'];
        } else {
            victimas = this.findVictimas(_data);
            imputados = this.findImputados(_data);
        }

        let date = new Date();

        if (date) {
            var dia  = date.getDate();
            var mes  = date.getMonth();
            var anio = date.getFullYear();
        }

        console.log('<<< examen >>>', examen);
        
        this.db.get('catalogos','tipo_examen').then(tipo_examen => {
            if (tipo_examen && examen.tipoExamen){
                let lista = tipo_examen['arreglo'] as any[]; 
                tipoExamen = lista[examen.tipoExamen.id];
            }

            this.data['xNUC']                     = _data.nuc? _data.nuc:'';
            this.data['xNIC']                     = _data.nic? _data.nic:'';
            this.data['xHechoDelictivo']          = _data.delitoPrincipal.nombre ? _data.delitoPrincipal.nombre : '';
            this.data['xVictima']                 = this.getListasPersonas(victimas)['nombres'].toLocaleString().toUpperCase();
            this.data['xImputado']                = this.getListasPersonas(imputados)['nombres'].toLocaleString().toUpperCase();
            this.data['xOficio']                  = examen.noOficio ? examen.noOficio : ''; 
            this.data['xEstado']                  = 'Estado de México';
            this.data['xPoblacion']               = this.auth.user.municipio;

            this.data['xDia']                     = dia.toString();
            this.data['xMes']                     = this.getMes(mes);
            this.data['xAnio']                    = anio.toString();
            this.data['xApercibimiento']          = examen.apercibimiento ? examen.apercibimiento : '';
            this.data['xMedicoLegistaMayus']      = examen.medicoLegista ? examen.medicoLegista.toUpperCase() : '';
            this.data['xSolicitaExamen']          = tipoExamen ? tipoExamen : '';
            this.data['xRealizaraExamen']         = examen.realizadoA ? examen.realizadoA : '';
            this.data['xNombreEmisorFirma']       = this.auth.user.nombreCompleto.toUpperCase();
            this.data['xCargoEmisorFirma']        = this.auth.user.cargo.toUpperCase();
            this.data['xAdscripcionEmisorFirma']  = this.auth.user.agenciaCompleto.toUpperCase();
            Logger.log('formato',this.data)
        });
    }



    public setDataF1011(_data,_id_solicitud){
        Logger.log('Formatos@setDataF1011', _data);
        
        let imputados = [];
        let victimas = [];
        let policia;

        _data.solicitudPrePolicias.forEach(solicitud => {
            if(solicitud.id===_id_solicitud){
                policia=solicitud;
            }
        });

        if (policia.heredar) {
            let personas = this.findHerenciaPersonas(_data, policia)
            victimas = personas['victimas'];
            imputados = personas['imputados'];
        } else {
            victimas = this.findVictimas(_data);
            imputados = this.findImputados(_data);
        }
        
        let date = new Date();

        this.data['xNUC']                    = _data.nuc ? _data.nuc:'';
        this.data['xNIC']                    = _data.nic ? _data.nic:'';
        this.data['xHechoDelictivo']         = _data.delitoPrincipal.nombre ? _data.delitoPrincipal.nombre : '';
        this.data['xVictima']                = this.getListasPersonas(victimas)['nombres'].toLocaleString().toUpperCase();
        this.data['xImputado']               = this.getListasPersonas(imputados)['nombres'].toLocaleString().toUpperCase();
        this.data['xOficio']                 = policia.noOficio ? policia.noOficio : '';
        this.data['xEstado']                 = 'Estado de México';
        this.data['xPoblacion']              = this.auth.user.municipio;
        this.data['xDia']                    = date ? date.getDate().toString() : '';
        this.data['xMes']                    = date ? this.getMes(date.getMonth()) : '';
        this.data['xAnio']                   = date ? date.getFullYear().toString() : '';
        this.data['xActuacionesSolicitadas'] = policia.actuacionesSolicitadas ? policia.actuacionesSolicitadas : '';
        this.data['xNombreEmisorFirma']      = this.auth.user.nombreCompleto.toUpperCase();
        this.data['xCargoEmisorFirma']       = this.auth.user.cargo.toUpperCase();
        this.data['xAdscripcionEmisorFirma'] = this.auth.user.agenciaCompleto.toUpperCase();
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

    public findHerenciaPersonas(_caso, _solicitud) {
        const personasIds  = _solicitud.personas;
        const listas = {};
        let victimas = [];
        let imputados = [];
        
        for (const personaId of personasIds) {
            if(_caso.findPersonaCaso(personaId.personaCaso.id) && (_caso.findPersonaCaso(personaId.personaCaso.id).tipoInterviniente.id ==  _config.optionValue.tipoInterviniente.victima || 
                _caso.findPersonaCaso(personaId.personaCaso.id).tipoInterviniente.id ==  _config.optionValue.tipoInterviniente.ofendido ||
                _caso.findPersonaCaso(personaId.personaCaso.id).tipoInterviniente.id ==  _config.optionValue.tipoInterviniente.victimaDesconocido)){
                victimas.push(_caso.findPersonaCaso(personaId.personaCaso.id));
            } else if(_caso.findPersonaCaso(personaId.personaCaso.id) && (_caso.findPersonaCaso(personaId.personaCaso.id).tipoInterviniente.id ==  _config.optionValue.tipoInterviniente.imputado || 
            _caso.findPersonaCaso(personaId.personaCaso.id).tipoInterviniente.id ==  _config.optionValue.tipoInterviniente.imputadoDesconocido)){
                imputados.push(_caso.findPersonaCaso(personaId.personaCaso.id));
            }
        }

        if(victimas.length==0){
            victimas = this.findVictimas(_caso);
        }
        if(imputados.length==0){
            imputados = this.findImputados(_caso);
        }
        listas['victimas']  = victimas;
        listas['imputados'] = imputados;
        return listas;
    }

    public findVictimas(_caso) {
        const personas = _caso.personaCasos;
        const victimas = [];

        for (const persona of personas) {
            if (persona.tipoInterviniente.id == _config.optionValue.tipoInterviniente.victima ||
                persona.tipoInterviniente.id == _config.optionValue.tipoInterviniente.ofendido ||
                persona.tipoInterviniente.id == _config.optionValue.tipoInterviniente.victimaDesconocido) {
                victimas.push(persona);
            }
        }

        return victimas;
    }

    public findImputados(_caso) {
        const personas = _caso.personaCasos;
        const imputados = [];

        for (const persona of personas) {
            if (persona.tipoInterviniente.id == _config.optionValue.tipoInterviniente.imputado ||
                persona.tipoInterviniente.id == _config.optionValue.tipoInterviniente.imputadoDesconocido) {
                imputados.push(persona);
            }
        }

        return imputados;
    }

    public findHerenciaNombresVictimas(_solicitud, _caso) {
        let personasIds  = _solicitud.personas;
        const personas = [];
        let nombres = "";
        let hasVictima = false;

        for (const personaId of personasIds) {
            if(_caso.findPersonaCaso(personaId.personaCaso.id) && (_caso.findPersonaCaso(personaId.personaCaso.id).tipoInterviniente.id ==  _config.optionValue.tipoInterviniente.victima || 
                _caso.findPersonaCaso(personaId.personaCaso.id).tipoInterviniente.id ==  _config.optionValue.tipoInterviniente.ofendido ||
                _caso.findPersonaCaso(personaId.personaCaso.id).tipoInterviniente.id ==  _config.optionValue.tipoInterviniente.victimaDesconocido)){
                    personas.push(_caso.findPersonaCaso(personaId.personaCaso.id));
                    hasVictima = true;
            }
        }

        if(!hasVictima){
            nombres = this.getListasPersonas(this.findVictimas(_caso))['nombres'].toLocaleString()
        }

        personas.forEach(o => {
            if(o.tipoInterviniente.id ==  _config.optionValue.tipoInterviniente.victimaDesconocido){
                nombres += ('Identidad desconocida ');
            }else {
                nombres += (` ${o.persona.nombre} ${o.persona.paterno} ${o.persona.materno}`);
            }
        });

        return nombres;
    }

    public findHerenciaNombresImputados(_solicitud, _caso) {
        let personasIds  = _solicitud.personas;
        const personas = [];
        let nombres = "";
        let hasVictima = false;

        for (const personaId of personasIds) {
            if(_caso.findPersonaCaso(personaId.personaCaso.id) && (_caso.findPersonaCaso(personaId.personaCaso.id).tipoInterviniente.id ==  _config.optionValue.tipoInterviniente.imputado || 
                _caso.findPersonaCaso(personaId.personaCaso.id).tipoInterviniente.id ==  _config.optionValue.tipoInterviniente.imputadoDesconocido)){
                    personas.push(_caso.findPersonaCaso(personaId.personaCaso.id));
                    hasVictima = true;
            }
        }

        if(!hasVictima){
            nombres = this.getListasPersonas(this.findImputados(_caso))['nombres'].toLocaleString()
        }

        personas.forEach(o => {
            if(o.tipoInterviniente.id ==  _config.optionValue.tipoInterviniente.imputadoDesconocido){
                nombres += ('Quién resulte responsable ');
            }else {
                nombres += (` ${o.persona.nombre} ${o.persona.paterno} ${o.persona.materno}`);
            }
        });

        return nombres;
    }

    public getListasPersonas(_personas) {
        const listas = {};
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
        const idiomas = [];

        _personas.forEach(o => {
            if (o.tipoInterviniente.id == _config.optionValue.tipoInterviniente.victimaDesconocido) {
                nombres.push(` Identidad desconocida`);
            } else if(o.tipoInterviniente.id == _config.optionValue.tipoInterviniente.imputadoDesconocido) {
                nombres.push(` Quien resulte responsable`);
            } else {
                nombres.push(` ${o.persona.nombre} ${o.persona.paterno} ${o.persona.materno}`);
            }
            if (o.tipoInterviniente) {
                calidadPersonas.push(` ${o.tipoInterviniente.tipo}`);
            }
            if (o.persona.tipoPersona) {
                tiposPersonas.push(` ${o.persona.tipoPersona}`);
            }
            if (o.persona.fechaNacimiento) {
                fechasNacimientos.push(` ${moment(o.persona.fechaNacimiento).format('LL')}`);
            }
            if (o.persona.rfc) {
                rfcs.push(` ${o.persona.rfc}`);
            }
            if (o.persona.curp) {
                curps.push(` ${o.persona.curp}`);
            }
            if (o.persona.edad) {
                edades.push(` ${o.persona.edad}`);
            }
            if (o.persona.folioIdentificacion) {
                folios.push(` ${o.persona.folioIdentificacion}`);
            }
            if (o.persona.estado) {
                originarios.push(` ${o.persona.estado.nombre}`);
            }
            if (o.persona.localizacionPersona.length > 0) {
                o.persona.localizacionPersona.forEach(l => {
                    domicilios.push(` ${(l.calle ? l.calle : '')} ${(l.noExterior ? l.noExterior : '')} ${(l.noInterior ? l.noInterior : '')} ${(l.colonia ? l.colonia.nombre : l.coloniaOtro)} ${(l.municipio ? l.municipio.nombre : l.municipioOtro)} ${(l.estado ? l.estado.nombre : l.estadoOtro)}`);
                    noParticulares.push(` ${l.telParticular}`);
                    noMoviles.push(` ${l.telMovil}`);
                })
            }
            if (o.persona.sexo) {
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
                if (o.persona.nacionalidadReligion.religion) {
                    religiones.push(` ${o.persona.nacionalidadReligion.religion}`);
                }
                if (o.persona.nacionalidadReligion.nacionalidad) {
                    nacionalidades.push(` ${o.persona.nacionalidadReligion.nacionalidad}`);
                }
            }
            if (o.persona.idiomaIdentificacion) {
                if (o.persona.idiomaIdentificacion.identificacion) {
                    identificaciones.push(` ${o.persona.idiomaIdentificacion.identificacion}`);
                }
                if (o.persona.idiomaIdentificacion.idioma) {
                    idiomas.push(` ${o.persona.idiomaIdentificacion.idioma}`);
                }
            }
        });

        listas['nombres'] = nombres;
        listas['calidadPersonas'] = calidadPersonas;
        listas['tiposPersonas'] = tiposPersonas;
        listas['noParticulares'] = noParticulares;
        listas['originarios'] = originarios;
        listas['edades'] = edades;
        listas['sexos'] = sexos;
        listas['domicilios'] = domicilios;
        listas['noMoviles'] = noMoviles;
        listas['fechasNacimientos'] = fechasNacimientos;
        listas['rfcs'] = rfcs;
        listas['curps'] = curps;
        listas['estadosCiviles'] = estadosCiviles;
        listas['ocupaciones'] = ocupaciones;
        listas['escolaridades'] = escolaridades;
        listas['religiones'] = religiones;
        listas['nacionalidades'] = nacionalidades;
        listas['identificaciones'] = identificaciones;
        listas['folios'] = folios;

        return listas;
    }

    public getMes(indexMonth){
        const meses = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        return meses[indexMonth].toString();
    }

    public getDatos() {
       var data = {
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
        //F1516
         'xRecibioLlamada':'',
      }

      return data;
    }

}
