export class Catalogos {

	public title: string;
	public url: string;

	constructor(_title: string, _url: string) {
		this.title = _title;
		this.url   = _url;
	}
}

export var _catalogos = {
	'paises': new Catalogos('Pais', '/v1/catalogos/pais'),
	'estados': new Catalogos('Estados', '/v1/catalogos/estado',),
}
