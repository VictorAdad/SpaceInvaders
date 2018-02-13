import { MOption } from '@partials/form/select2/select2.component';
import { CIndexedDB } from '@services/indexedDB';
import { Logger } from "@services/logger.service";
/**
 * Clase base para manejar las matrices
 */
export class MatrizGlobal {
    /**
     * indica el campo seleccionado, este se utiliza para filtar la informacion
     */
    public selected;
    /**
     * arreglo con los elementos que coinciden con los parametros de busqueda
     */
    public finded   = [];
    /**
     * arreglo con los elementos de la matriz
     */
    public objects  = [];

    constructor(private superDb:CIndexedDB, private catalogo: string){

    }

    /**
     * regresa la matriz de datos
     * @param _exclude 
     */
    public getMatriz(_exclude: string[] = []){
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
                    && String(attr) !== 'filterBy'
                    && String(attr) !== 'clean'
                    && String(attr) !== 'superDb'){
                    if(!(_exclude.indexOf(attr) > -1))
                        this[String(attr)] = this.getUniques(this.objects, attr);
                }
            }
        });
    }
    /**
     * filtra los campos de data, para obtener un moption con valores unicos.
     * @param _data arreglo del que sacaran los datos
     * @param _unique llave en la que buscaran los datos unicos
     * @return un arreglo de MOption
     */
    public getUniques(_data:any, _unique:string){
        let options: MOption[] = [];

        for(let name of this.getUnique(_data, _unique)){
            options.push({value: name, label: name});
        }

        return options;
    }

    /**
     * filtra los campos de data, para obtener un arreglo con los campos unicos.
     * @param _data arreglo del que sacaran los datos
     * @param _unique llave en la que buscaran los datos unicos
     * @return un arreglo con datos unicos
     */
    public getUnique(_data:any, _unique:string): string[]{
        let uniques: string[] = [];

        for(let i = 0; i< _data.length; i++){
            if(_data[i][_unique] !== null)
                if(uniques.indexOf(_data[i][_unique]) === -1)
                    uniques.push(_data[i][_unique]);
        }

        return uniques;

    }
    /**
     * Funcion que filtra los campos de la matrix de acuerdo al campo selected, el campo selected se llena con los datos de _e,_tipo
     * @param _e valor 
     * @param _tipo llave
     */
    public find(_e, _tipo:string){
        if (typeof _e!=="undefined" && _e!='')
            this.selected[_tipo] = _e;
        else
            this.selected[_tipo] = null;
        this.finded = this.objects.filter(object => {
            return this.validate(object, this.selected);
        });      
    }
    /**
     * Funcion para saber si dos objectos son iguales. Necesitan sobreescribir todos las clases hijas
     * @param _object tipo objeto
     * @param _selected tipo objeto
     * @return true o false dependiendo si _object==_select
     */
    public validate(_object, _selected){
        return true;
    }
    /**
     * Filtra de la matriz de datos(object) la informacion por una columna padre. Pro ejemplo si queres fltrar la informacion de marcaSubmarca por tipo de vehiculo y marca. tienes que usar esta funcion.
     * @param _val valor con el que se filtraran los campos.
     * @param _filter llave que se tomara en cuenta.
     * @param _attr atributo de la clase que guardara los datos.
     * @example por ejemplo si queremos filtrar las marcas de marcaSubmarca  de acuerdo a tipoVehiculo igual a automovil, usariamos
     * marcaSubmarca.filterBy("AUTOMOVIL","tipoVehiculo","marca")
     */
    public filterBy(_val, _filter, _attr){
        // Logger.log('Matriz@filter()', _val, _filter, _attr);
        if(_val){
            let filtered = this.objects.filter(o => o[_filter] === _val);
            this[_attr] = this.getUniques(filtered, _attr);
        }else{
            this[_attr] = [];
        }
    }

}
