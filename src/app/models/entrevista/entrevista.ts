export class Entrevista {
    autoridadRealizaEntrevista: string;
    lugarRealizaEntrevista: string;
    nombreEntrevistado: string;
    sexo: Sexo = new Sexo();
    fechaNacimiento: string;
    edad: number;
    nacionalidad: string;
    originarioDe: string;
    estadoMigratorio: string;
    tipoInterviniente: TipoInterviniente = new TipoInterviniente();
    tipoIdentificacion: string;
    emisorIdentificacion: string;
    noIdentificacion: string;
    curp: string;
    rfc: string;
    sabeLeerEscribir: boolean;
    gradoEscolaridad: string;
    ocupacion; string;
    lugarOcupacion: string;
    estadoCivil: string;
    salarioSemanal: number;
    relacionEntrevistado: string;
    //Domicilio
    calle: string;
    noExterior: string;
    noInterior: string;
    colonia: string;
    cp: string;
    municipio: string;
    estado: string;
    noTelefonoParticular: string;
    noTelefonoCelular: string;
    correoElectronico: string;
    //Datos
    tieneRepresentanteLegal: boolean;
    nombreRepresentanteLegal: string;
    medioTecnologicoRegistro: boolean;
    medioTecnologicoUtilizado: string;
    medioTecnicoRegistro: boolean;
    medioTecnicoUtilizado: string;
    narracionHechos: string;
    observaciones: string;
    caso: Caso = new Caso();
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
	activo: boolean;
	created: Date;
	updated: Date;

	createdBy: number;
	updatedBy: number;
}

export class TipoInterviniente {
	id: number;
	tipo: string;
	created: Date;
	updated: Date;

	createdBy: number;
	updatedBy: number;
}