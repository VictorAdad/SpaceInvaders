/**
 * clase para hacer operaciones comunes en json
 */
export class Yason {
    /**
     * Funcion recursiva que elimina los nodos nulos o undefined
     * @param x json del qeu se eliminaran los nulos
     */
	public static  eliminaNulos(x){
                if (typeof x == "object"){
                    for(let i in x){
                        if (x[i]==null || typeof x[i] =="undefined"){
                            delete x[i];
                        }
                        if (typeof x[i]=="object")
                            this.eliminaNulos(x[i]);
                    }
                }
            }
    /**
     * Funcion para crear copias de objectos, esta incompleta pues as copias no son total mente funcionales.
     * @param original json del cual se crea la copia
     * @return regresa un json con la copia del original
     */
    public static copiaJson(original){
        if (typeof original=="object"){
            var obj={};
            for(let item in original)
                obj[item]=this.copiaJson(original[item]);
            return obj;
        }else
            return original;
    }

    /**
     *  convierte un dataURl a blob
     *   esto sirve cuando se combierte un archivo a dataUrl y  despues se quiere regresar a la normalidad
     *   recordar que un file hereda de blob.
     * @param dataURI es la informacion en formato dataUri 
     * @param type el tipo del archvio que deseamos obtener, para hacer correctamente el casteo de la informacion.
     * @return un blob
     */
    public static dataURItoBlob(dataURI, type) {
        var binary = atob(dataURI);
        var array = [];
        for(var i = 0; i < binary.length; i++) {
            array.push(binary.charCodeAt(i));
        }
        return new Blob([new Uint8Array(array)], {type: type});
    }
    /**
     * Busca todos los elementos de la lista que coincidadan con _item en todos sus llaves.
     * @param lista lista de objectos
     * @param _item objecto
     */
    public buscaTodosLosElementosEnLista(lista, _item){
        var rec=function(e,y) {
            if((typeof e)=="object"){
                let igual=true;
                for (var element in e){
                    igual=igual&&rec(e[element],y[element]);
                }
                return igual;
            }
            return e==y;
        }
        var coincidencias=[];
        for (let item in lista){
            if (rec(_item,lista[item]))
                coincidencias.push(Yason.copiaJson(lista[item])); 
        }
        return coincidencias;

    }
    /**
     * Regresa verdadero o falso dependiendo si esta o no el item en la lista
     * @param _item El elemento que se buscara
     * @param _lista La lista de elementos
     */
    public static itemInArray(_item,_lista:any[]) {
        const encontrado = _lista.find(function(element) {
            return element == _item;
          });
        return typeof encontrado != 'undefined';
    }

}