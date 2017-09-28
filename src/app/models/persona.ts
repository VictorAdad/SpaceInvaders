import { Caso } from '@models/caso';

export class Persona {
    id          : number;
    tipoPersona : string;
    tipoInterviniente: string;
    //datos identidad
    razonSocial : string;
    nombre      : string;
    materno: string;
    paterno: string;
    sexo:string;
    fechaNacimiento:string;
    edad:number;
    curp:string;
    nacionalidad:string;
    paisNacimiento:string;
    estadoNacimiento:string;
    municipio:string;
    escolaridad:string;
    ocupacion:string;
    lugarDeTrabajo:string;
    ingresosMensuales:number;
    rfc:string;
    estadoCivil:string;
    numeroHijos: number;
    religion:string;
    hablaEspaniol:boolean;
    lenguaIndigena:string;
    grupoEtnico:string;
    alfabetismo:string;
    familiaLinguistica:string;
    necesitaInterprete:boolean;
    adicciones:string;
    detenido:boolean;
    fechaDetencion:string;
    horaDentencion:string;
    tipoDentencion:string;
    fechaDeclaracion:string;
    tipoReincidencia:string;
    cereso:string;
    //datos de identificacion
    documentoDeIdentificacion:string;
    autoridadEmisora:string;
    numeroOFoliodeDocumento:string;
    alias       : string;
    otrosNombres:string;
    //datos de localizacion
    pais:string;
    estado:string;
    municipioODelegacion:string;
    coloniaOAsentamiento:string;
    localidad:string;
    calle:string;
    noExterior:string;
    noInerior:string;
    cp:number;
    tipoDomicilio:string;
    referencias:string;
    telParticular:string;
    telTrabajo:string;
    extTelTrabajo:string;
    telMovil:string;
    fax:string;
    otroMedioContacto:string;
    extOtroMedioContacto:string;
    tipoResidencia:string;
    //medida de filiacion
    complecion:string;
    piel:string;
    cara:string;
    cabelloCantidad:string;
    cabelloColor:string;
    cabelloForma:string;
    cabelloCalvicie:string;
    cabelloImplantacion:string;
    frenteAltura:string;
    frenteInclinacion:string;
    frenteAncho:string;
    cejasDireccion:string;
    cejasImplantacion:string;
    cejasForma:string;
    cejasTamanio:string;
    ojosColor:string;
    ojosForma:string;
    ojosTamanio:string;
    narizRoof:string;
    narizDorzo:string;
    narizAncho:string;
    narizBase:string;
    narizAltura:string;
    bocaTamanio:string;
    bocaComisuras:string;
    labiosEspesor:string;
    labiosAlturaNasoLabial:string;
    labiosProminencia:string;
    mentontipo:string;
    mentonForma:string;
    mentonInclinacion:string;
    orejaDerechaForma:string;
    orejaDerechaHelixOriginal:string;
    orejaDerechaHelixposterior:string;
    orejaDerechaHelixAdherencia:string;
    orejaDerechaLobuloContorno:string;
    orejaDerechaLobuloAdherencia:string;
    orejaDerechaLobuloParticular:string;
    orejaDerechaLobuloDimensional:string;
    orejaIzquierdaForma:string;
    orejaIzquierdaHelixOriginal:string;
    orejaIzquierdaHelixposterior:string;
    orejaIzquierdaHelixadherencia:string;
    orejaIzquierdaLobuloContorno:string;
    orejaIzquierdaLobuloAdherencia:string;
    orejaIzquierdaLobuloParticular:string;
    orejaIzquierdaLobuloDimensional:string;
    sangreTipo:string;
    sangreFactorRh:string;
    tallaPeso:number;
    tallaAltura:number;
    usaAnteojos:boolean;
    cicatrises:string;
    tatuajes:string;
    lunares:string;
    protesis:string;
    otros:string;
    caso: Caso = new Caso();
}