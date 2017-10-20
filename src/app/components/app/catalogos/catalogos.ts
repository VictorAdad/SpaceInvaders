export class Catalogos {

	public title: string;
	public url: string;

	constructor(_title: string, _url: string) {
		this.title = _title;
		this.url   = _url;
	}
}

export var _catalogos = {
	//funcionan
	'paises'					: new Catalogos('Pais', '/v1/catalogos/pais'),
	'delitos' 					: new Catalogos('Delitos', '/v1/catalogos/delitos'),
	'sexo'						: new Catalogos('Sexo','/v1/catalogos/persona/sexo'),
	'escolaridad'				: new Catalogos('Escolaridad','/v1/catalogos/persona/escolaridad'),
	'ocupacion'					: new Catalogos('Ocupación','/v1/catalogos/persona/ocupacion'),
	'estado-civil'				: new Catalogos('Estado civil','/v1/catalogos/persona/estado-civil'),
	'grupo-etnico'				: new Catalogos('Grupo etnico','/v1/catalogos/persona/grupo-etnico'),
	'alfabetismo'				: new Catalogos('Alfabetismo','/v1/catalogos/persona/alfabetismo'),
	'interprete'				: new Catalogos('Interprete','/v1/catalogos/persona/interprete'),
	'adiccion'					: new Catalogos('Adicción','/v1/catalogos/persona/adiccion'),
	'subdireccion'				: new Catalogos('Subdirección','/v1/catalogos/usuario/subdireccion'),
	'presento-llamada'			: new Catalogos('Presento llamada','/v1/catalogos/entrevista/presento-llamadas'),
	'tipo-linea'				: new Catalogos('Tipo linea','/v1/catalogos/predenuncia/tipo-linea'),
	'tipo-persona'				: new Catalogos('Tipo persona','/v1/catalogos/predenuncia/tipo-persona'),
	'denuncia-querella'			: new Catalogos('Denuncia querella','/v1/catalogos/solicitud-preliminar/denuncia-querella'),
	'victima-querellante'		: new Catalogos('Victima querellante','/v1/catalogos/solicitud-preliminar/victima-querellante'),
	'perito-materia'			: new Catalogos('Perito materia','/v1/catalogos/solicitud-preliminar/perito-materia'),
	'tipo-examen'				: new Catalogos('Tipo examen','/v1/catalogos/solicitud-preliminar/tipo-examen'),

	//tienen dependencias
	'estados'					: new Catalogos('Estados', '/v1/catalogos/estado'),
	'municipio'					: new Catalogos('Municipio','/v1/catalogos/municipio'),
	'colonia'					: new Catalogos('Colonia','/v1/catalogos/colonia'),
	'localidad'					: new Catalogos('Localidad','/v1/catalogos/localidad'),
	
	//listar
	'forma-conducta' 			: new Catalogos('Forma conducta','/v1/catalogos/relacion/forma-conducta'),
	'modalidad-delito' 			: new Catalogos('Modalidad delito','/v1/catalogos/relacion/modalidad-delito'),
	'forma-comision' 			: new Catalogos('Forma comisión','/v1/catalogos/relacion/forma-comision'),
	'clasificacion-delito'		: new Catalogos('Clasificación delito','/v1/catalogos/relacion/clasificacion-delito'),
	'elemento-comision'			: new Catalogos('Elemento comisión','/v1/catalogos/relacion/elemento-comision'),
	'concurso-delito'			: new Catalogos('Concurso delito','/v1/catalogos/relacion/concurso-delito'),
	'clasificacion-delito-orden': new Catalogos('Clasificación delito orden','/v1/catalogos/relacion/clasificacion-delito-orden'),
	'grado-participacion'		: new Catalogos('Grado participación','/v1/catalogos/relacion/clasificacion-delito-orden'),
	'forma-accion'				: new Catalogos('Forma acción','/v1/catalogos/relacion/forma-accion'),

	//No tiene servicios
	'turno'						: new Catalogos('Turno',''),
	
	//problema al guardar
	'distrito'					: new Catalogos('Distrito','/v1/catalogos/usuario/distrito'),
	'fiscalia'					: new Catalogos('Fiscalía','/v1/catalogos/usuario/fiscalia'),
	'agencia'					: new Catalogos('Agencia','/v1/catalogos/usuario/agencia'),
	'base'						: new Catalogos('Base','/v1/catalogos/usuario/base'),
	


}