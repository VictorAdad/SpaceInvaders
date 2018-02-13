import { CIndexedDB } from '@services/indexedDB';
/**
 * Clase para caonsultar datos en la base de indexedb
 */
export class Consultas{
    municipio :any;
    estado :any;
    pais :any;
    sexo :any;
    nacionalidadReligion :any;
    escolaridad :any;
    estadoCivil :any;
    ocupacion :any;
    alfabetismo: any;
    constructor(public db:CIndexedDB){
        this.initCatalogo('sexo','sexo');
        this.initCatalogo('municipio','municipio');
        this.initCatalogo('pais','pais');
        this.initCatalogo('nacionalidad_religion','nacionalidadReligion');
        this.initCatalogo('estado','estado');
        this.initCatalogo('escolaridad','escolaridad');
        this.initCatalogo('estado_civil','estadoCivil');
        this.initCatalogo('ocupacion','ocupacion');
        this.initCatalogo('alfabetismo','alfabetismo');
    }

    initCatalogo(catalogo, propiedad){
        let obj = this;
        this.db.get('catalogos',catalogo).then( lista =>{
            obj[propiedad]=lista;
        });
    }

    get(catalogo,id){
        console.log('catalogo',catalogo, this[catalogo], id);
        if (catalogo == 'nacionalidadReligion'){
            const coincidencias = (this[catalogo]['arreglo'] as any[]).filter( e => { 
                return e.id == id;
                });
            console.log(coincidencias);
            if (coincidencias.length >0 )
                return( {id:id, nacionalidad:coincidencias[0]['nacionalidad']});
        }
        else if (catalogo=='estado' || catalogo == 'municipio'){
            const coincidencias = (this[catalogo]['arreglo'] as any[]).filter( e => { return e.id == id;});
            if (coincidencias.length >0 )
                return( {id:id, nombre:coincidencias[0]['nombre']});
            
        }else{
            if (this[catalogo]['arreglo'][id])
                return {id:id, nombre:this[catalogo]['arreglo'][id]}
        }
        return null;
    }

    getArregloJson(catalogo,id): Promise<any>{
        let obj = this;
        return new Promise<any>( (resolve,reject) => {
            this.db.get('catalogos',catalogo).then(cat => {
                //arreglo es un json
                if (cat && cat['arreglo']) {
                    resolve( {id:id, nombre:cat['arreglo'][id]});
                }else{
                    reject(null);
                }
            }).catch(e => {
                reject(null);
            })
        });
    }
    getArregloConjunto(catalogo,id): Promise<any>{
        let obj = this;
        return new Promise<any>( (resolve,reject) => {
            this.db.get('catalogos',catalogo).then(cat => {
                // arreglo es un conjunto
                if (cat && cat['arreglo']) {
                    const coincidencias = (cat['arreglo'] as any[]).filter( e => { e.id == id});
                    if (coincidencias.length >0 )
                        resolve( {id:id, nombre:coincidencias[0]['nombre']});
                    else {
                        reject(null);
                    }
                }else{
                    reject(null);
                }
            }).catch(e => {
                reject(null);
            })
        });
    }
     /**
     * Regresa una promesa que devuelve un json{id:,nombre:} que concuerdan con el id dado o null
     * @param id del sexo a buscar
     */
    getSexo(id): Promise<any>{
        return this.getArregloJson('sexo',id);
    }
    getOcupacion(id): Promise<any>{
        return this.getArregloJson('ocupacion',id);
    }
    getEstado(id): Promise<any>{
        return this.getArregloConjunto('estado',id);
    }
    getPais(id): Promise<any>{
        return this.getArregloJson('pais',id);
    }
    getMunicipio(id): Promise<any>{
        return this.getArregloConjunto('municipio',id);
    }
    getEscolaridad(id): Promise<any>{
        return this.getArregloJson('escolaridad',id);
    }
    getEstadoCivil(id): Promise<any>{
        return this.getArregloJson('estado_civil',id);
    }
    getNacionalidadReligion(id): Promise<any>{
        let obj =this;
        return new Promise<any>( (resolve,reject) => {
            this.db.get('catalogos','nacionalidad_religion').then(cat => {
                // arreglo es un conjunto
                if (cat && cat['arreglo']) {
                    const coincidencias = (cat['arreglo'] as any[]).filter( e => { e.id == id});
                    if (coincidencias.length >0 )
                        resolve( {id:id, nombre:coincidencias[0]['nacionalidad']});
                    else {
                        reject(null);
                    }
                }else{
                    reject(null);
                }
            }).catch(e => {
                reject(null);
            })
        });
    }

}