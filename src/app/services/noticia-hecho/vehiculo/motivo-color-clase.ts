import { HttpService } from '@services/http.service';
import { MatrizGlobal } from '../matriz-global';

export class MatrizMotivoColorClase extends MatrizGlobal{

    public motivoRegistro = [];
    public clase          = [];
    public color          = [];

    constructor(
        private http: HttpService
        ) {
        super(http);
        this.selected = new MotivoClaseColor();
        this.getMatriz('/v1/catalogos/motivo-color-clase');
    }

    public findClaseArma(_e, _tipo:string){
        this.selected[_tipo] = _e;
        this.finded = this.objects.filter(object => {
            return object.motivoRegistro === this.selected.motivoRegistro
                && object.clase === this.selected.clase
                && object.color === this.selected.color;
        });
    }

}

export class MotivoClaseColor {
    public motivoRegistro: string = '';
    public clase: string = '';
    public color: string = '';
}
