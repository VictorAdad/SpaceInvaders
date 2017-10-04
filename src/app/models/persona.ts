export class Persona {
    id          : number;
    tipoPersona : string;
    //datos identidad
    razonSocial : string;
    nombre      : string;
    materno: string;
    paterno: string;
    fechaNacimiento:string;
    edad:number;
    curp:string;
    lugarDeTrabajo:string;
    ingresosMensuales:number;
    rfc:string;
    numeroHijos: number;
   
    autoridadEmisora:string;
    numeroOFoliodeDocumento:string;

    horaDentencion:string;             // verificar
   
    sexo: Sexo = new Sexo();
    caso: Caso = new Caso();
    estadoCivil: EstadoCivil = new EstadoCivil();
    nacionalidadReligion: NacionalidadReligion = new NacionalidadReligion();
    paisNacimiento: Pais = new Pais();
    estadoNacimiento: Estado = new Estado();
    municipio: Municipio = new Municipio();
    escolaridad: Escolaridad = new Escolaridad();
    ocupacion: Ocupacion = new Ocupacion();
    hablaEspaniol: IdiomaIdentificacion = new IdiomaIdentificacion();
    grupoEtnico: GrupoEtnico = new GrupoEtnico();
    alfabetismo: Alfabetismo = new Alfabetismo();
    necesitaInterprete: Interprete = new Interprete();
    adicciones: Adiccion = new Adiccion();
    localizacionPersona: LocalizacionPersona = new LocalizacionPersona();
    personaNic: PersonaNic = new PersonaNic();
    alias: AliasNombrePersona = new AliasNombrePersona();
    mediaFiliacion: MediaFiliacion = new MediaFiliacion();

}

export class Caso {
    public id       : number;
    public titulo   : string;
    public sintesis : string;
    public delito   : string;
    public nic      : string;
    public nuc      : string;
}

export class Sexo {
    id: number;
    nombre: string;
}

export class NacionalidadReligion{
    public id: number;
    public nacionalidad: string;
    public religion: string;
}

export class EstadoCivil {
    public id: number;
    public nombre: string;
}


export class Pais {
    public id: number;
    public nombre: string;
}

export class Estado {
    public id: number;
    public nombre: string;

    pais: Pais = new Pais();
}

export class Municipio {
    public id: number;
    public nombre: string

    estado: Estado = new Estado();
}

export class Colonia {
    public id: number;
    public nombre: string;
    public cp: number;
    public created: Date;
    public updated: Date;
    public createdBy: number;
    public updatedBy: number;

    municipio: Municipio = new Municipio();

}

export class Localidad{
    public id: number;
    public nombre: string;
    public created: Date;
    public updated: Date;
    public createdBy: number;
    public updatedBy: number;

    colonia: Colonia = new Colonia();
}

export class Escolaridad {
    public id: number;
    public nombre: string;
}

export class Ocupacion {
    public id: number;
    public nombre: string;
}

export class IdiomaIdentificacion {
    public id: number;
    public hablaEspaniol: boolean;
    public lenguaIndigena: string;
    public familiaLinguistica: string;
    public identificacion: string;
}

export class GrupoEtnico {
    public id: number;
    public nombre: string;

}

export class Alfabetismo {
    public id: number;
    public nombre: string;

}

export class Interprete {
    public id: number;
    public nombre: string;
}

export class Adiccion {
    public id: number;
    public nombre: string;
}

export class LocalizacionPersona {
    public id: number;
    public calle: string;
    public NoExterior: string;
    public NoInterior: string;
    public cp: number;                
    public tipoDomicilio: number;    //tipo de domicilio esta pendiente 
    public referencias: string;
    public telParticular: string;
    public telTrabajo: string;
    public extencion: number;
    public telMovil: string;
    public fax: string;
    public otroMedioContacto: string;
    public correo: string;
    public tipoResidencia: string;
    public estadoOtro: string;
    public municipioOtro: string;
    public coloniaOtro: string;
    public localidadOtro: string;

    pais: Pais = new Pais();
    estado: Estado = new Estado();
    municipio: Municipio = new Municipio();
    localidad: Localidad = new Localidad();

}

export class PersonaNic {
    public id: number;
    public detenido: boolean;

    detalleDetenido: DetalleDetenido = new DetalleDetenido();

}

export class DetalleDetenido {
    public id: number;
    public fechaDetencion: Date;
    public fechaDeclaracion: Date;

    tipoDetenido: TipoDetenido = new TipoDetenido(); 
}

export class TipoDetenido {
    public id: number;
    public tipoDetencion: string;
    public tipoReincidencia: string;
    public cereso: string;
    public created: Date;
    public updated: Date;
    public createdBy: number;
    public updatedBy: number;

}

export class AliasNombrePersona {
    public id: number;
    public nombre: string;
    public tipo: string;
    public created: Date;
    public updated: Date;
    public createdBy: number;
    public updatedBy: number;
}

export class MediaFiliacion {
    public id: number;

    public tallaPeso:number;
    public tallaAltura:number;
    public usaAnteojos:boolean;
    public cicatrises:string;
    public tatuajes:string;
    public disminucionesFisicas: string;
    public lunares:string;
    public protesis:string;
    public otros:string;

    oreja: Oreja = new Oreja();
    complexionPielSangre: ComplexionPielSangre = new ComplexionPielSangre();
    caraNariz: CaraNariz = new CaraNariz();  
    frenteMenton: FrenteMenton = new FrenteMenton();
    cejaBoca: CejaBoca = new CejaBoca();
    cabello: Cabello = new Cabello();
    labioOjo: LabioOjo = new LabioOjo();

}

export class LabioOjo {
    public id: number;
    public espesorLabio: string;
    public alturaNasoLabialLabio: string;
    public prominenciaLabio: string;
    public colorOjo: string;
    public formaOjo: string;
    public tamanoOjo: string; 
}

export class Cabello {
    public id: number; 
    public cantidad: string;
    public color: string;
    public forma: string;
    public calvicie: string;
    public implantacion: string;

}

export class CejaBoca {
    public id: number;
    public direccionCeja: string;
    public implantacionCeja: string;
    public formaCeja: string;
    public tamanoCeja: string;
    public tamanoBoca: string;
    public comisuraBoca: string;
}

export class FrenteMenton{
    public id: number;
    public alturaFrente: string;
    public inclinacionFrente: string;
    public anchoFrente: string;
    public tipoMenton: string;
    public formaMenton: string;
    public inclinacionMenton: string;
}

export class CaraNariz {
    public id: number;
    public formaCara: string;
    public raizNariz: string;
    public dorsoNariz: string;
    public anchoNariz: string;
    public baseNariz: string;
    public alturaNariz: string;
}

export class ComplexionPielSangre{
    public id: number;
    public tipoComplexion: string;
    public colorPiel: string;
    public tipoSangre: string;
    public FactorRhSangre: string;
}

export class Oreja {
    id: number;
    forma: string;
    helixOriginal: string;
    helixSuperior: string; 
    helixPosterior: string;
    helixAdherencia: string;
    lobuloContorno: string;
    lobuloAdherencia: string;
    lobuloParticularidad: string;
    lobuloDimension: string;
}





