import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';


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