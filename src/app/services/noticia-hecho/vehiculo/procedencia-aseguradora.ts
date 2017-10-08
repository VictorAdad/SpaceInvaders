import { HttpService } from '@services/http.service';
import { Global } from '../global';

export class MatrizProcedenciaAseguradora extends Global{

    public procedencia = [];
    public aseguradora = [];

    constructor(
        private http: HttpService
        ) {
        super(http);
        this.selected = new ProcedenciaAseguradora();
        this.getMatriz('/v1/catalogos/procedencia-aseguradora');
    }

}

export class ProcedenciaAseguradora {
    public procedencia: string = '';
    public aseguradora: string = '';
}
