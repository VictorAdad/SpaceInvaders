//clase para hacer operaciones comunes en json
export class Yason {
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

    public static copiaJson(original){
        if (typeof original=="object"){
            var obj={};
            for(let item in original)
                obj[item]=this.copiaJson(original[item]);
            return obj;
        }else
            return original;
    }

    
    /*
        convierte un dataURl a blob
        esto sirve cuando se combierte un archivo a dataUrl y  despues se quiere regresar a la normalidad
        recordar que un file hereda de blob.
    */
    public static dataURItoBlob(dataURI, type) {
        var binary = atob(dataURI);
        var array = [];
        for(var i = 0; i < binary.length; i++) {
            array.push(binary.charCodeAt(i));
        }
        return new Blob([new Uint8Array(array)], {type: type});
    }

}