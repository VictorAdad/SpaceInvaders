import { MOption } from '@partials/form/select2/select2.component';
import { CIndexedDB } from '@services/indexedDB';

export class MatrizGlobal {

    public selected;
    public finded   = [];
    public objects  = [];

    constructor(private superDb:CIndexedDB, private catalogo: string){

    }

    public getMatriz(){
        this.superDb.get("catalogos",this.catalogo).then(response=>{
            this.objects = response["arreglo"];
            if ((response["arreglo"])["data"]){
                this.objects = (response["arreglo"])["data"];
            }
            for(let attr in this){
                if(
                    String(attr) !== 'selected'
                    && String(attr) !== 'finded'
                    && String(attr) !== 'objects'
                    && String(attr) !== 'getUniques'
                    && String(attr) !== 'getUnique'
                    && String(attr) !== 'constructor'
                    && String(attr) !== 'find'
                    && String(attr) !== 'validate'
                    && String(attr) !== 'getMatriz'
                    && String(attr) !== 'db'
                    && String(attr) !== 'catalogo'
                    && String(attr) !== 'superDb'){
                    this[String(attr)] = this.getUniques(this.objects, attr);
                }
            }
        });
    }

    public getUniques(_data:any, _unique:string){
        let options: MOption[] = [];

        for(let name of this.getUnique(_data, _unique)){
            options.push({value: name, label: name});
        }

        return options;
    }


    public getUnique(_data:any, _unique:string): string[]{
        let uniques: string[] = [];

        for(let i = 0; i< _data.length; i++){
            if(_data[i][_unique] !== null)
                if(uniques.indexOf(_data[i][_unique]) === -1)
                    uniques.push(_data[i][_unique]);
        }

        return uniques;

    }

    public find(_e, _tipo:string){
        if (typeof _e!=="undefined")
            this.selected[_tipo] = _e;
        else
            this.selected[_tipo] = null;
        this.finded = this.objects.filter(object => {
            return this.validate(object, this.selected);
        });
    }

    public validate(_object, _selected){
        return true;
    }

}
