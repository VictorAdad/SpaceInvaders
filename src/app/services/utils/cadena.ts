
/**
 * Clase con operaciones comunes de cadenas de texto
 */
export class Cadena{
    /**
     * Funcion que elimina los acentos comunes de las palabras
     * @param s Cadena a la que se quitaran los acentos
     */
    public static quitaAcentos(s) {
        var r=s;
        r = r.replace(new RegExp(/[àáâãäåā]/g),"a");
        r = r.replace(new RegExp(/[èéêëē]/g),"e");
        r = r.replace(new RegExp(/[ìíîïī]/g),"i");            
        r = r.replace(new RegExp(/[òóôõöō]/g),"o");
        r = r.replace(new RegExp(/[ùúûüū]/g),"u");
        r = r.replace(new RegExp(/[ÀÁÂÃÄÅĀ]/g),"A");
        r = r.replace(new RegExp(/[ÈÉÊËĒ]/g),"E");
        r = r.replace(new RegExp(/[ÌÍÎÏĪ]/g),"I");      
        r = r.replace(new RegExp(/[ÒÓÔÕÖŌ]/g),"O");
        r = r.replace(new RegExp(/[ÙÚÛÜŪ]/g),"U");
        return r;
    }
}