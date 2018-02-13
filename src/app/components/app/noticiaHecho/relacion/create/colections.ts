import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Logger } from "@services/logger.service";


export class Colections {

	public efectoDetalle: EfectoDetalle[] = [];
    public trataPersonas: TrataPersonas[] = [];
    public hostigamiento: Hostigamiento[] = [];
    public subjectEfectoDetalle:BehaviorSubject<EfectoDetalle[]> = new BehaviorSubject<EfectoDetalle[]>([]);
    public subjectTrataPersonas:BehaviorSubject<TrataPersonas[]> = new BehaviorSubject<TrataPersonas[]>([]);
    public subjectHostigamiento:BehaviorSubject<Hostigamiento[]> = new BehaviorSubject<Hostigamiento[]>([]);
    public sourceEfectoDetalle:RelDataSource = new RelDataSource(this.subjectEfectoDetalle);
    public sourceTrataPersonas:RelDataSource = new RelDataSource(this.subjectTrataPersonas);
    public sourceHostigamiento:RelDataSource = new RelDataSource(this.subjectHostigamiento);

	constructor() {

    }
    
    public del(_arr: string, _subject: string, _source: string, _indice:number){
        this[_arr].splice(_indice,1);
        this[_subject] = new BehaviorSubject<EfectoDetalle[]>(this[_arr]);
        this[_source] =new RelDataSource(this[_subject]);
    }

    public add(_arr: string, _subject: string, _data:any){
        this[_arr].push(_data);
        this[_subject].next(this[_arr]);
    }


}

export class EfectoDetalle {

    public id: string;
    public efecto: string;
    public detalle: string;
    
}

export class TrataPersonas {

    constructor(
        _object,
        _options,
        _estadosOrigen,
        _municipiosOrigen,
        _estadosDestino,
        _municipiosDestino,
        _optionsRelacion
        ){

        if (_object.paisOrigen)
            this.paisOrigen = _options.find('paises', _object.paisOrigen.id).label;
        else
            this.paisOrigen="";
        if (!_object.estadoOrigenOtro && !_object.estadoOrigen)
            _object.estadoOrigenOtro="";
        else if (_object.estadoOrigenOtro && _object.estadoOrigenOtro!="")
            this.estadoOrigen=_object.estadoOrigenOtro;
        else if (_object.estadoOrigen && _object.estadoOrigen.id!=""){
            if (_estadosOrigen.length>0)
            this.estadoOrigen    = 
                typeof _estadosOrigen[_object.estadoOrigen.id] !== 'undefined' ? _options.buscaItemConValue(_options["estados"],_object.estadoOrigen.id).label  : '';
            else{
                let estado=_options.buscaItemConValue(_options["estados"],_object.estadoOrigen.id);
                this.estadoOrigen    =  estado? estado["label"] : '';
            }
        }
        
        if (!_object.municipioOrigenOtro && !_object.municipioOrigen)
            _object.municipioOrigenOtro="";
        else if (_object.municipioOrigenOtro && _object.municipioOrigenOtro!="")
            this.municipioOrigen = _object.municipioOrigenOtro;
        else if (_object.municipioOrigen && _object.municipioOrigen.id!="")
            if (_object.municipioOrigen['nombre']) {
                this.municipioOrigen = _object.municipioOrigen['nombre'];
            }
            else if (_municipiosOrigen.length>0){
                let municipio=_options.buscaItemConValue(_municipiosOrigen,_object.municipioOrigen.id);
                this.municipioOrigen = municipio ? municipio.label : '';
            }else{
                _options.getMunicipiosByEstadoService(_object.estadoOrigen.id).then(respuesta=>{
                    let municipios=_options.constructOptions(respuesta);
                    let municipio=_options.buscaItemConValue(municipios,_object.municipioOrigen.id);
                    this.municipioOrigen=municipio?municipio.label:"";
                })
            }

        if (_object.paisDestino)    
            this.paisDestino=_options.find('paises', _object.paisDestino.id).label;
        else
            this.paisDestino="";

        if (!_object.estadoDestinoOtro && !_object.estadoDestino)
            _object.estadoDestinoOtro="";
        else if (_object.estadoDestinoOtro && _object.estadoDestinoOtro!="")
            this.estadoDestino = _object.estadoDestinoOtro;
        else if (_object.estadoDestino && _object.estadoDestino.id!=""){
            if (_estadosDestino.length>0)
            this.estadoDestino   =
                typeof _estadosDestino[_object.estadoDestino.id] !== 'undefined' ? _options.buscaItemConValue(_options["estados"],_object.estadoDestino.id).label : '';
            else{
                let estado=_options.buscaItemConValue(_options["estados"],_object.estadoDestino.id);
                this.estadoDestino = estado? estado["label"] : '';
            }
        }
        
        if (!_object.municipioDestinoOtro && !_object.municipioDestino)
            _object.municipioDestinoOtro="";
        else if (_object.municipioDestinoOtro && _object.municipioDestinoOtro!="")
            this.municipioDestino=_object.municipioDestinoOtro;
        else if (_object.municipioDestino && _object.municipioDestino.id!=""){
            if (_object.municipioDestino['nombre']) {
                this.municipioDestino = _object.municipioDestino['nombre'];
            }
            else if (_municipiosDestino.length>0)//todavia no se incilizan los estados
            {
                let municipio=_options.buscaItemConValue(_municipiosDestino,_object.municipioDestino.id);
                this.municipioDestino=
                    municipio ? municipio["label"]: '';
            }else{//hay que consultar los municipios del estado
                _options.getMunicipiosByEstadoService(_object.estadoDestino.id).then(respuesta=>{
                    let municipios=_options.constructOptions(respuesta);
                    let municipio=_options.buscaItemConValue(municipios,_object.municipioDestino.id);
                    this.municipioDestino=municipio?municipio.label:"";
                })
            }
        }

        if ( _object.tipo)
            this.tipo = _object.tipo;
        else
            this.tipo = "";
        if (_object.transportacion)
            this.transportacion  = _object.transportacion;
        else
            _object.transportacion = "";

    }

    public id: string;
    public paisOrigen: string;
    public estadoOrigen: string;
    public municipioOrigen: string;
    public paisDestino: string;
    public estadoDestino: string;
    public municipioDestino: string;
    public tipo: string;
    public transportacion: string;

}

export class Hostigamiento {

    public id: string;
    public modalidad: string;
    public conducta: string;
    public ambito: string;
    public detalleConducta: string;
    public testigo: string;
    
}

export class RelDataSource extends DataSource<any> {
    /** Connect function called by the table to retrieve one stream containing the data to render. */
    constructor(private data:BehaviorSubject<any[]>){super()}

    connect(): Observable<any[]> {
      return this.data.asObservable();
    }
  
    disconnect() {}
}