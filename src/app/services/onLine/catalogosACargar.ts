/**
 * Clase que contienen la lista de las matrices y catalos a sincronizar
 */
export class CatalogosACargar {
    /**
     * Lista de matrices
     */
    public static readonly matricesASincronizar=[
        //persona
        {//45
            catalogo:"oreja",
            uri:"/v1/catalogos/media-filiacion/oreja"
        },
        {//36
            catalogo:"labio_ojo",
            uri:'/v1/catalogos/media-filiacion/labio-ojo'
        },
        {//31
            catalogo:"frente_menton",
            uri:'/v1/catalogos/media-filiacion/frente-menton'

        },
        {//14
            catalogo:"complexion_piel_sangre",
            uri:'/v1/catalogos/media-filiacion/complexion-piel-sangre'
        },
        {//9
            catalogo:"ceja_boca",
            uri:'/v1/catalogos/media-filiacion/ceja-boca'

        },
        {//8
            catalogo:"cara_nariz",
            uri:'/v1/catalogos/media-filiacion/cara-nariz'

        },
        {//6
            catalogo:"cabello",
            uri:'/v1/catalogos/media-filiacion/cabello'

        },
        {//43
            catalogo:"nacionalidad_religion",
            uri:'/v1/catalogos/nacionalidad-religion'

        },
        {//52
            catalogo:"tipo_detenido",
            uri:'/v1/catalogos/persona/tipo-detenido'

        },
        {//34
            catalogo:"idioma_identificacion",
            uri:'/v1/catalogos/persona/idioma'

        },
        //armas
        {//10
            catalogo:"clase_arma",
            uri:'/v1/catalogos/arma/clase-arma' 

        },
        {//7
            catalogo:"calibre_mecanismo",
            uri:'/v1/catalogos/arma/calibre-mecanismo'    
        },
        //lugares
        {//19
            catalogo:"detalle_lugar", 
            uri:'/v1/catalogos/lugar/detalle-lugar'
        },
        //vehiculos
        {//58
            catalogo:"tipo_uso_tipo_vehiculo",
            uri:'/v1/catalogos/vehiculo/tipo-uso-vehiculo'

        },
        {//49
            catalogo:"procedencia_aseguradora",
            uri:'/v1/catalogos/vehiculo/procedencia-aseguradora'

        },
        {//41
            catalogo:"motivo_color_clase",
            uri:'/v1/catalogos/vehiculo/motivo-color-clase'

        },
        {//38
            catalogo:"marca_submarca",
            uri:'/v1/catalogos/vehiculo/marca-submarca'


        },
        //relacion
        {//39
            catalogo:"modalidad_ambito",
            uri:'/v1/catalogos/relacion/modalidad-ambito'
        },
        {//61
            catalogo:"violencia_genero",
            uri:'/v1/catalogos/relacion/violencia-genero'
        },
        {//57
            catalogo:"tipo_transportacion",
            uri:'/v1/catalogos/relacion/tipo-transportacion'
        },
        {//21
            catalogo:"efecto_detalle",
            uri:'/v1/catalogos/relacion/efecto-detalle'
        },
        {
            catalogo:"desaparicion_consumacion",
            uri:'/v1/catalogos/relacion/desaparicion-consumacion'
        },
        {//16
            catalogo:"conducta_detalle",
            uri:'/v1/catalogos/relacion/conducta-detalle'
        },


    ];
    /**
     * Lista de catalogos
     */
    public static readonly catalogosASincronizar=[
        //persona
        {//17
            catalogo:"delito",
            uri:"/v1/catalogos/delitos"
        },
        {//40
            catalogo:"modalidad_delito",
            uri:'/v1/catalogos/relacion/modalidad-delito/options'
        },
        {//15
            catalogo:"concurso_delito",
            uri:'/v1/catalogos/relacion/concurso-delito/options'
        },
        {//32
            catalogo:"grado_participacion",
            uri:'/v1/catalogos/relacion/grado-participacion/options'
        },
        {//29
            catalogo:"forma_comision",
            uri:'/v1/catalogos/relacion/forma-comision/options'
        },
        {//12
            catalogo:"clasificacion_delito_orden",
            uri:'/v1/catalogos/relacion/clasificacion-delito-orden/options'
        },
        {//28
            catalogo:"forma_accion",
            uri:'/v1/catalogos/relacion/forma-accion/options'
        },
        {//22
            catalogo:"elemento_comision",
            uri:'/v1/catalogos/relacion/elemento-comision/options'
        },
        {//30
            catalogo:"forma_conducta",
            uri:'/v1/catalogos/relacion/forma-conducta/options'
        },
        {//50
            catalogo:"sexo",
            uri:'/v1/catalogos/persona/sexo/options'
        },
        {//23
            catalogo:"escolaridad",
            uri:'/v1/catalogos/persona/escolaridad/options'
        },
        {//44
            catalogo:"ocupacion", 
            uri:'/v1/catalogos/persona/ocupacion/options'
        },
        {//25
            catalogo:"estado_civil",
            uri:'/v1/catalogos/persona/estado-civil/options'
        },
        {//33
            catalogo:"grupo_etnico",
            uri:'/v1/catalogos/persona/grupo-etnico/options'
        },
        {//3
            catalogo:"alfabetismo",
            uri:'/v1/catalogos/persona/alfabetismo/options'
        },
        {//35
            catalogo:"interprete",
            uri:'/v1/catalogos/persona/interprete/options'
        },
        {//46
            catalogo:"pais",
            uri:'/v1/catalogos/pais/options'
        },
        {//24
            catalogo:"estado",
            uri:'/v1/catalogos/estado'
        },
        {//42
            catalogo:"municipio",
            uri:'/v1/catalogos/municipio'
        },
        {//20
            catalogo:"distrito",
            uri:'/v1/catalogos/usuario/distrito/options'
        },
        {//10
            catalogo:"clasificacion_delito",
            uri:'/v1/catalogos/relacion/clasificacion-delito/options'
        },
        {//11
            catalogo:"clasificacion_delito_orden",
            uri:'/v1/catalogos/relacion/clasificacion-delito-orden/options'
        },
        {
            catalogo:"tipo_interviniente",
            uri:'/v1/catalogos/tipos-intervinientes/options'
        },
        {//60
            catalogo:"victima_querellante",
            uri:'/v1/catalogos/solicitud-preliminar/victima-querellante/options'
        },
        {//18
            catalogo:"denuncia_querella",
            uri:'/v1/catalogos/solicitud-preliminar/denuncia-querella/options'
        },
        {//47
            catalogo:"perito_materia",
            uri:'/v1/catalogos/solicitud-preliminar/perito-materia/options'
        },
        {//54
            catalogo:"tipo_examen",
            uri:'/v1/catalogos/solicitud-preliminar/tipo-examen/options'
        },
        {//1
            catalogo:"adiccion",
            uri:'/v1/catalogos/persona/adiccion/options'
        },
        {//53
            catalogo:"tipo_domicilio",
            uri:'/v1/catalogos/tipo-domicilio/options'
        },
        {//56
            catalogo:"tipo_persona",
            uri:'/v1/catalogos/predenuncia/tipo-persona/options'
        },
        {//2
            catalogo:"agencia",
            uri:"/v1/catalogos/usuario/agencia/options"
        },
        {//5
            catalogo:"base",
            uri:"/v1/catalogos/usuario/base/options"
        },
        {//27
            catalogo:"fiscalia",
            uri:"/v1/catalogos/usuario/fiscalia/options"
        },
        {//37
            catalogo:"localidad",
            uri:"/v1/catalogos/localidad"
        },
        {//48
            catalogo:"presento_llamada",
            uri:"/v1/catalogos/entrevista/presento-llamadas/options"
        },
        {//51
            catalogo:"subdireccion",
            uri:"/v1/catalogos/usuario/subdireccion/options"
        },
        {//59
            catalogo:"turno",
            uri:"/v1/catalogos/usuario/turno/options"
        },
        {
            catalogo:"tipo_linea",
            uri:"/v1/catalogos/predenuncia/tipo-linea/options"
        },
        {
            catalogo:"colonia",
            uri:"/v1/catalogos/colonia"
        }

    ];
}
