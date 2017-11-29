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
}