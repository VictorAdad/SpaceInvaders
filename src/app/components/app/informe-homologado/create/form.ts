import {FormBuilder} from '@angular/forms';

export class Form {
  public static createForm(_fbuilder: FormBuilder) {
    return _fbuilder.group({
      fechaCreacion: [''],
      numeroReferencia: [''],
      primerResponsable: [''],
      institucion: [''],
      municipio: [''],
      cuip: [''],
      // 2
      enteroHecho: [''],
      especifique: [''],
      fechaConocimiento: [''],
      horaConocimiento: [''],
      // 3
      fechaArribo: [''],
      horaArribo: [''],
      entidadArribo: [''],
      municipioArribo: [''],
      localidadArribo: [''],
      calleArribo: [''],
      numIntArribo: [''],
      numExtArribo: [''],
      entreCalleArribo: [''],
      tramoCarreteroArribo: [''],
      tipoArribo: [''],
      kmArribo: [''],
      latitudArribo: [''],
      longitudArribo: [''],
      riesgoPara: [''],
      tipoRiesgo: [''],
      especifiqueRiesgo: [''],
      apoyo: [''],
      numEconomico: [''],
      especifiqueApoyo: [''],
      narracionHechosResponsable: [''],
      //radios
      proteccion: [''],
      recepcionAcciones: [''],
      recoleccionAcciones: [''],
      proteccionAcciones: [''],
      resguardoAcciones: [''],
      preservacionAcciones: [''],
      informarAcciones: [''],
      proteccionAccionesA: [''],
      resguardoAccionesA: [''],
      detencionAcciones: [''],
      fuerzaAcciones: [''],
      puestoAcciones: [''],
      inventarioAcciones: [''],
      trasladoAcciones: [''],
      inspeccionesAcciones: [''],
      echosFavorAcciones: [''],
      trasladoAccionesA: [''],
      trasladoAccionesDe: [''],
      inspeccionesAccionesA: [''],
      entrevistasAcciones: [''],
      // 4
      fechaPreservacion: [''],
      horaPreservacion: [''],
      acordonamiento: [''],
      cuipAcordonamiento: [''],
      paternoAcordonamiento: [''],
      maternoAcordonamiento: [''],
      nombreAcordonamiento: [''],
      adcripcionAcordonamiento: [''],
      resguardo: [''],
      cuipResguardo: [''],
      paternoResguardo: [''],
      maternoResguardo: [''],
      nombreResguardo: [''],
      adcripcionResguardo: [''],
      // 5
      fechaCertificado: [''],
      horaCertificado: [''],
      medico: [''],
      medicoAgencia: [''],
      nombreAgencia: [''],
      municipioAgencia: [''],
      calleAgencia: [''],
      numAgencia: [''],
      medicoParticular: [''],
      municipioParticular: [''],
      calleParticular: [''],
      numParticular: [''],
      cuipParticular: [''],
      paternoParticular: [''],
      maternoParticular: [''],
      nombreParticular: [''],
      adscripcionParticular: [''],
      // Anexo 1
      detenido: [''],
      comprendioDerechos: [''],
      cuipDetenido: [''],
      paternoDetenido: [''],
      maternoDetenido: [''],
      nombreDetenido: [''],
      adscripcionDetenido: [''],
      // Anexo 2
      motivoDetencion: [''],
      fechaDetencion: [''],
      horaDetencion: [''],
      entidadDetencion: [''],
      municipioDetencion: [''],
      localidadDetencion: [''],
      calleDetencion: [''],
      numIntDetencion: [''],
      numExtDetencion: [''],
      entreCalleDetencion: [''],
      cpDetencion: [''],
      latitudDetencion: [''],
      longitudDetencion: [''],
      paternoDetecion: [''],
      maternoDetecion: [''],
      nombreDetencion: [''],
      sexoDetencion: [''],
      edadRefeDetencion: [''],
      calleDetenido: [''],
      numExtDetenido: [''],
      numIntDetenido: [''],
      cpDetenido: [''],
      fechaDetenido: [''],
      casadoDetenido: [''],
      ocupacionDetenido: [''],
      nacionalidadDetenido: [''],
      rfcCurpDetenido: [''],
      lecturaDerechosDetenido: [''],
      señalesParticularesDetenido: [''],
      descripcionFisicaDetenido: [''],
      tipoVestimentaDetenido: [''],
      pertenenciasDetenido: [''],

      // Anexo 3
      situacionUsoFuerza: [''],
      asistenciaMedica: [''],
      nivelUsoFuerza: [''],
      detenidoFuerza: [''],
      paternoFuerza: [''],
      maternoFuerza: [''],
      nombreFuerza: [''],
      primerResponsableFuerza: [''],
      paternoPrimerFuerza: [''],
      maternoPrimerFuerza: [''],
      nombrePrimerFuerza: [''],
      trasladoCanalizacion: [''],
      fechaCanalizacion: [''],
      horaCanalizacion: [''],
      // Anexo 5
      detenidoPertenencia: [''],
      objeto: [''],
      cantidadObjeto: [''],
      // Anexo 6
      paternoVictima: [''],
      maternoVictima: [''],
      nombreVictimam: [''],
      cuipVictima: [''],
      paternoPrimerVictima: [''],
      maternoPrimerVictima: [''],
      nombrePrimerVictima: [''],
      cuipRespondiente: [''],
      paternoRespondiente: [''],
      maternoRespondiente: [''],
      nombreRespondiente: [''],
      // Anexo 7
      trasladoA: [''],
      tipoTraslado: [''],
      especifiqueTraslado: [''],
      agenciaTraslado: [''],
      estadoAgenciaTraslado: [''],
      municipioAgenciaTraslado: [''],
      coloniaAgenciaTraslado: [''],
      calleAgenciaTraslado: [''],
      numExtAgenciaTraslado: [''],
      cpAgenciaTraslado: [''],
      calidadTraslado: [''],
      paternoTraslado: [''],
      maternoTraslado: [''],
      nombresTraslado: [''],
      edadTraslado: [''],
      // numExtPersonaTraslado: [''],
      cuipEntregaTraslado: [''],
      paternoEntregaTraslado: [''],
      maternoEntregaTraslado: [''],
      nombreEntregaTraslado: [''],
      cargaEntregaTraslado: [''],
      paternoRecibeTraslado: [''],
      maternoRecibeTraslado: [''],
      nombreRecibeTraslado: [''],
      cargaRecibeTraslado: [''],
      fechaTraslado: [''],
      horaTraslado: [''],

      //Anexo 8
      tipoLugarIntervencion: [''],
      otroLugarIntervencion: [''],
      caracterLugarIntervencion: [''],
      sueloIntervencion: [''],
      condicionesIntervencion: [''],
      iluminacionIntervencion: [''],
      objetosIntervencion: [''],
      tipoObjetosEncontradosArma: [''],
      tipoObjetosEncontradosDinero: [''],
      tipoObjetosEncontradosPersonas: [''],
      tipoObjetosEncontradosArmaTipo: [''],
      tipoObjetosEncontradosArmaCantidad: [''],
      tipoObjetosEncontradosArmaDineroMoneda: [''],
      tipoObjetosEncontradosDineroMoneda: [''],
      tipoObjetosEncontradosDineroOtra: [''],
      tipoObjetosEncontradosDineroCantidad: [''],
      tipoObjetosEncontradosPersonasCantidad: [''],
      tipoObjetosEncontradosCadaver: [''],
      tipoObjetosEncontradosRestosHumanos: [''],
      objetosEncontradosDocumentos: [''],
      tipoObjetosEncontradosDocumentos: [''],
      tipoObjetosEncontradosCadaverCantidad: [''],
      tipoObjetosEncontradosRestosHumanosCantidad: [''],
      tipoObjetosEncontradosDocumentosCantidad: [''],
      objetosEncontradosOtroObjeto: [''],
      tipoObjetosEncontradosOtroObjeto: [''],
      tipoObjetosEncontradosCaracteristicasNarcoticos: [''],
      tipoObjetosEncontradosOtroObjetoCantidad: [''],
      tipoObjetosEncontradosCaracteristicasNarcoticosTipo: [''],
      tipoObjetosEncontradosCaracteristicasNarcoticosCantidad: [''],

      inspeccionesPersonas: [''],
      inspeccionesPersonasPaterno: [''],
      inspeccionesPersonasMaterno: [''],
      inspeccionesPersonasNombres: [''],
      inspeccionesPersonasObjetos: [''],
      objetosEncontradosArmas: [''],
      objetosEncontradosDinero: [''],
      objetosEncontradosCaracteristicasNarcoticos: [''],
      objetosEncontradosArmasTipo: [''],
      objetosEncontradosArmasCantidad: [''],
      objetosEncontradosDineroMoneda: [''],
      objetosEncontradosDineroOtra: [''],
      objetosEncontradosDineroCantidad: [''],
      objetosEncontradosCaracteristicasNarcoticosTipo: [''],
      objetosEncontradosCaracteristicasNarcoticosCantidad: [''],
      objetosEncontradosOtroObjetoCantidad: [''],
      objetosEncontradosDocumentosCantidad: [''],

      inspeccionMedioTransporte: [''],

      objetosEncontradosMedioTransporteTipo: [''],
      objetosEncontradosMedioTransporteMarca: [''],
      objetosEncontradosMedioTransporteSubmarca: [''],
      objetosEncontradosMedioTransporteModelo: [''],
      objetosEncontradosMedioTransportePlaca: [''],
      objetosEncontradosMedioTransporteNumeroPermiso: [''],
      objetosEncontradosMedioTransporteNumeroSerie: [''],
      objetosEncontradosMedioTransporteNumeroMotor: [''],
      objetosEncontradosMedioTransporteNumeroColor: [''],
      objetosEncontradosMedioTransporteProcedencia: [''],
      inspeccionesMedioTransportePaterno: [''],
      inspeccionesMedioTransporteMaterno: [''],
      inspeccionesMedioTransporteNombres: [''],
      objetosEncontradosMedioTransporteObjetoRelacionado: [''],
      armasObjetosEncontrados: [''],
      armasObjetosEncontradosArmaTipo: [''],
      cargadoresObjetosEncontrados: [''],
      cartuchosObjetosEncontrados: [''],
      armasCantidadObjetosEncontrados: [''],
      cargadoresCantidadObjetosEncontrados: [''],
      cartuchosCantidadObjetosEncontrados: [''],
      casquillosObjetosEncontrados: [''],
      dineroObjetosEncontrados: [''],
      caracteristicasNarcoticosObjetosEncontrados: [''],
      casquillosCantidadObjetosEncontrados: [''],
      dineroMonedaObjetosEncontrados: [''],
      dineroOtraObjetosEncontrados: [''],
      dineroCantidadObjetosEncontrados: [''],
      caracteristicasNarcoticosTipoObjetosEncontrados: [''],
      caracteristicasNarcoticosCantidadObjetosEncontrados: [''],
      documentosTipoObjetosEncontrados: [''],
      personasTipoObjetosEncontrados: [''],
      cadaverTipoObjetosEncontrados: [''],
      documentosCantidadTipoObjetosEncontrados: [''],
      cadaverCantidadTipoObjetosEncontrados: [''],
      personasCantidadTipoObjetosEncontrados: [''],
      restosHumanosTipoObjetosEncontrados: [''],
      otroObjetoTipoObjetosEncontrados: [''],
      restosHumanosCantidadTipoObjetosEncontrados: [''],
      otroObjetoCantidadTipoObjetosEncontrados: [''],
      //Anexo 9
      inventarioTipoObjeto: [''],
      inventarioCantidad: [''],
      inventarioEspecificacion: [''],
      //Anexo 10
      entregaLugar: [''],
      entregaEntidad: [''],
      entregaMunicipio: [''],
      entregaColonia: [''],
      entregaCalle: [''],
      entregaNumInterior: [''],
      entregaNumExterior: [''],
      entregaCp: [''],
      //Anexo 11
      entrevistaVictimaPersona: [''],
      lugarFechaEntrevistaFecha: [''],
      lugarFechaEntrevistaHora: [''],
      lugarFechaEntrevistaColonia: [''],
      lugarFechaEntrevistaCalle: [''],
      lugarFechaEntrevistaNumExterior: [''],
      datosEntrevistadoPaterno: [''],
      datosEntrevistadoMaterno: [''],
      datosEntrevistadoNombres: [''],
      datosEntrevistadoSexo: [''],
      datosEntrevistadoEstado: [''],
      datosEntrevistadoMunicipio: [''],
      datosEntrevistadoColonia: [''],
      datosEntrevistadoCalle: [''],
      datosEntrevistadoNumExterior: [''],
      datosEntrevistadoNumInterior: [''],
      datosEntrevistadoCp: [''],
      datosEntrevistadoFechaNacimiento: [''],
      datosEntrevistadoCurp: [''],
      datosEntrevistadoEstadoCivil: [''],
      datosEntrevistadoOcupacion: [''],
      datosEntrevistadoRelato: [''],
      datosEntrevistadorCuip: [''],
      datosEntrevistadorApellidoPaterno: [''],
      datosEntrevistadorApellidoMaterno: [''],
      datosEntrevistadorNombres: [''],
      datosEntrevistadorAdscripcion: [''],
    })
  }
}
